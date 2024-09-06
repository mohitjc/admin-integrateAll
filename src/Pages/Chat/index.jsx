import { Fragment, useEffect, useRef, useState } from "react";
import Layout from "../../components/global/layout";
import socketModel from "../../models/socketModel";
import ApiClient from "../../methods/api/apiClient";
import { useSelector } from "react-redux";
import methodModel from "../../methods/methods";
import environment from "../../environment";
import loader from "../../methods/loader";
import datepipeModel from "../../models/datepipemodel";
import { useNavigate } from "react-router-dom";

export default function Chat() {
  const history = useNavigate()
  const user=useSelector(state=>state.user)
  // const imageExtensions = ["jpg", "jpeg", "png", "gif", "bmp"];
  const currectChat=useRef()
  const messages=useRef()
  const [chatMessages, setChatMessages] = useState([]);
  const [chatRooms, setChatRooms] = useState([]);
  const [chatRoomId, setChatRoomId] = useState("");
  const [search, setSearch] = useState('');
  const [text, setText] = useState('');
  const [cloader, setCLoader] = useState('');
  const [assignment, setAssignment] = useState();
  let role = methodModel.getPrams('role')
  let ar = sessionStorage.getItem("activeRooms");
  const activeRooms = useRef(ar ? JSON.parse(ar) : []);

  const chatScroll = () => {
    // Scroll to the bottom after sending a message
    var chatBox = document.getElementById("chat-box");
    if (chatBox) chatBox.scrollTop = chatBox.scrollHeight;
  };

  const getChatMessages = (id) => {
    // loader(true);
    ApiClient.get("chat/user/message/all", { room_id: id },environment.chat_api).then((res) => {
      if (res.success) {
        let data = res.data.data;
        setChatMessages(data);
        messages.current = data;
        setTimeout(() => {
          chatScroll();
        }, 100);
      }
      // loader(false);
    });
  };

  const ReadChat=(assignment_id)=>{
    let payload = {
        user_id: user._id,
        room_id: assignment_id,
      }
   
    loader(true)
    ApiClient.put('chat/user/read-all-messages',payload,environment.chat_api).then(res=>{
      loader(false)
      if(res.success){
        // let room_id=res.data.room_id
        // setChatRoomId(room_id)
        // currectChat.current=room_id
      }
    })
  }


  const joinChat=(assignment_id)=>{
    let payload = {
        chat_by: user._id,
        chat_with: assignment_id,
        role: role
      }

    loader(true)
    ApiClient.post('chat/user/join-group',payload,{},environment.chat_api).then(res=>{
      loader(false)
      if(res.success){
        let room_id=res.data.room_id
        setChatRoomId(room_id)
        currectChat.current=room_id
      }
    })
  }

  const assignmentDetail=(id)=>{
    ApiClient.get('assignment/detail',{id:id}).then(res=>{
      if(res.success){
        setAssignment(res.data)
      }
    })
  }


  useEffect(()=>{
    socketModel.on("receive-message", (data) => {
      console.log("data", data);
      const payload = {
        user_id: user?.id || user?._id,
        message_id: data?._id,
        role: "user"
      }
      socketModel.emit("read-message", payload);
      if (currectChat.current == data.data.room_id) {
        messages.current.push({ ...data.data });

        const uniqueMessages = Array.from(
          new Set(messages.current.map((message) => message._id))
        ).map((id) => {
          return messages.current.find((message) => message._id === id);
        });

        console.log("uniqueMessages", uniqueMessages);
        setChatMessages([...uniqueMessages]);
        setTimeout(() => {
          chatScroll();
        }, 100);
      }
    });
    let assignment_id = methodModel.getPrams('assignment_id')
    if (assignment_id) {
      assignmentDetail(assignment_id)
      joinChat(assignment_id)
    }
    
  },[])
  useEffect(() => {
    if (chatRoomId != "") {
      let value = {
        room_id: chatRoomId,
        user_id: user?._id,
      };
      socketModel.emit("join-room", value);
      ReadChat(chatRoomId)
      if (!activeRooms.current.includes(chatRoomId)) {
        console.log("activeRooms inner", activeRooms);
        activeRooms.current.push(chatRoomId);
        sessionStorage.setItem(
          "activeRooms",
          JSON.stringify(activeRooms.current)
        );
        socketModel.emit("join-room", value);
      }
      // socketModel.emit("unread-count", value);
      // socketModel.emit("read-all-message", value);

      getChatMessages(chatRoomId);
    }
  }, [chatRoomId]);

  const handleSubmit=()=>{
    if(!text) return 
    let value={
      room_id:chatRoomId,
      type:'TEXT',
      content:text,
      assignment_id:assignment?.id || assignment?._id,
      role: role
    }
    socketModel.emit("send-message", value);
    setText('')
  }

  const uploadImage=(e)=>{
    let files=e.target.files
    // const fileExtension = files?.name?.split(".").pop().toLowerCase();
    // let isTrue = imageExtensions.includes(fileExtension);

    // let url = isTrue
    //   ? "upload/image?modelName=users"
    //   : "upload/document?modelName=documents";

    loader(true)
    ApiClient.multiImageUpload('user/uploadImage',files).then(res=>{
       e.target.value=''
       loader(false)
      if(res.success){
        let value={
          room_id:chatRoomId,
          type:'IMAGE',
          content:res.image,
          assignment_id:assignment?.id || assignment?._id,
          role: role
        }
        console.log("value",value)
        socketModel.emit("send-message", value);
      }
    })
   
  }

  return (
    <>
      <Layout>
        <div className="">
        <div className="flex items-center  mb-5">
        <button onClick={()=>history("/assignment")} className="!px-4  py-2 flex items-center justify-center  rounded-lg shadow-btn  text-[#fff] bg-[#1E5DBC] border transition-all  mr-3"><i className="fa fa-angle-left text-lg"></i></button>
       <h3 className="text-[20px] font-[600]">Chat</h3>
       </div>
          <div className="bg-gray-100 h-[655px] flex border border-gray-200">
          
            {/* <div className="w-80 bg-white border-r border-gray-200  flex flex-col">
             <div className="py-4 px-4 border-b border-gray-200 bg-[#00358503]">
                <div className="relative">
                <i className="fa fa-search absolute top-4 left-3 text-[#00000096] text-[13px]"></i>
             <input type="search" name="search" placeholder="Search User" className="border p-2 pl-8 w-full rounded-[4px] "/>
                </div>
             </div>
              <ul className="flex-1 overflow-y-auto mt-5 p-4">
                <li className="flex  mb-6 justify-between items-start">
                  <div className="flex items-center">
                    <div className="w-10 h-10  rounded-full">
                      <img src="assets/img/skill/team1.png" />
                    </div>
                    <p className="ms-3 text-[14px] font-medium leading-[20px]">
                      John Smith
                      <span className="block text-[12px] text-[#00000094] tracking-wider	">
                        Lorem ipsum dolor sit amet{" "}
                      </span>
                    </p>
                  </div>
                  <p className="text-[12px] text-[#000000c2]">12.45pm</p>
                </li>
                <li className="flex  mb-6 justify-between items-start">
                  <div className="flex items-center">
                    <div className="w-10 h-10  rounded-full">
                      <img src="assets/img/skill/team2.png" />
                    </div>
                    <p className="ms-3 text-[14px] font-medium leading-[20px]">
                      Henry
                      <span className="block text-[12px] text-[#00000094] tracking-wider	">
                        Lorem ipsum dolor sit amet{" "}
                      </span>
                    </p>
                  </div>
                  <p className="text-[12px] text-[#000000c2]">12.45pm</p>
                </li>
                <li className="flex  mb-6 justify-between items-start">
                  <div className="flex items-center">
                    <div className="w-10 h-10  rounded-full">
                      <img src="assets/img/skill/team3.png" />
                    </div>
                    <p className="ms-3 text-[14px] font-medium leading-[20px]">
                      John Smith
                      <span className="block text-[12px] text-[#00000094] tracking-wider	">
                        Lorem ipsum dolor sit amet{" "}
                      </span>
                    </p>
                  </div>
                  <p className="text-[12px] text-[#000000c2]">12.45pm</p>
                </li>
              </ul>
            </div> */}

            <div className="flex-1 flex flex-col">
              
              <div className="p-3 px-4 border-b border-gray-200 bg-[#003585d9] rounded-[4px]">
             
                <div className="flex items-center">
                  {/* <div className="w-12 h-12  rounded-full">
                    <img src="assets/img/skill/team3.png" />
                  </div> */}
                  <div className="ms-3">
                    <h1 className="text-[17px] font-semibold leading-[20px] text-white capitalize">
                      {assignment?.title}
                    </h1>
                    <span className="text-[#00000094] text-[12px] leading-[14px] text-white">
                     Due Date: {datepipeModel.date(assignment?.dueDate)}
                    </span>
                  </div>
                </div>
              </div>
              {chatMessages?.length == 0 ?
              <img src="assets/img/lets-chat.jpg" className="h-[500px] object-cover"/>
              :<div className="p-4 flex-1 overflow-y-auto bg-white h-[600px]" id="chat-box">
                {chatMessages.map((itm, i) => {
                  return <Fragment key={i}>
                    {itm.sender == user?._id ? <>
                      <div className="mb-4 flex items-start flex-row-reverse">
                        <div className="w-10 h-10  rounded-full">
                          <img src={methodModel.userImg(itm.sender_image)} className="w-10 h-10  rounded-full" />
                        </div>
                        <div className="me-3 bg-gray-200 text-green-900 p-2 rounded-lg">
                          
                          {itm.type=='IMAGE'?<>
                          <img src={methodModel.noImg(itm.content)} className="w-[150px] object-contain" />
                          
                          <span className="block text-xs text-gray-500 mt-2">
                          {datepipeModel.date(itm?.createdAt)},{datepipeModel.time(itm?.createdAt)}</span>
                          </>:<>
                            <p>{itm.content}</p>
                            <span className="block text-xs text-gray-500 mt-2">
                            {datepipeModel.date(itm?.createdAt)},{datepipeModel.time(itm?.createdAt)}</span>
                          </>}
                        </div>
                      </div>
                    </> : <>
                      <div className="mb-4 flex items-start">
                        <div className="w-10 h-10  rounded-full">
                          <img src={methodModel.userImg(itm.sender_image)} />
                        </div>
                        <div className="ml-3 bg-blue-100 text-blue-900 p-2 rounded-lg">
                        {itm.type=='IMAGE'?<>
                          <img src={methodModel.noImg(itm.content)} className="w-[150px] object-contain" />
                          <span className="block text-xs text-gray-500 mt-2">
                          {datepipeModel.date(itm?.createdAt)},{datepipeModel.time(itm?.createdAt)}
                          </span>
                          </>:<>
                            <p>{itm.content}</p>
                            <span className="block text-xs text-gray-500 mt-2">
                            {datepipeModel.date(itm?.createdAt)},{datepipeModel.time(itm?.createdAt)}
                            </span>
                          </>}
                        </div>
                      </div>
                    </>}
                  </Fragment>
                })}
               
              </div>}
              <div className="border-t border-gray-200 bg-[#f2f3f4] p-4">
                <form className="flex items-center relative" onSubmit={e=>{e.preventDefault();handleSubmit()}}>
                  <label className="absolute left-[10px] cursor-pointer">
                  <svg xmlns="http://www.w3.org/2000/svg" class=" text-[20px] w-[20px] " viewBox="0 0 45.7 45.7"><path d="M6.6,45.7A6.7,6.7,0,0,1,0,39.1V6.6A6.7,6.7,0,0,1,6.6,0H39.1a6.7,6.7,0,0,1,6.6,6.6V39.1h0a6.7,6.7,0,0,1-6.6,6.6ZM39,4H6.6A2.6,2.6,0,0,0,4,6.6V39.1a2.6,2.6,0,0,0,2.6,2.6H39.1a2.6,2.6,0,0,0,2.6-2.6V6.6A2.7,2.7,0,0,0,39,4Zm4.7,35.1Zm-4.6-.4H6.6a2.1,2.1,0,0,1-1.8-1.1,2,2,0,0,1,.3-2.1l8.1-10.4a1.8,1.8,0,0,1,1.5-.8,2.4,2.4,0,0,1,1.6.7l4.2,5.1,6.6-8.5a1.8,1.8,0,0,1,1.6-.8,1.8,1.8,0,0,1,1.5.8L40.7,35.5a2,2,0,0,1,.1,2.1A1.8,1.8,0,0,1,39.1,38.7Zm-17.2-4H35.1l-6.5-8.6-6.5,8.4C22,34.6,22,34.7,21.9,34.7Zm-11.2,0H19l-4.2-5.1Z" fill="#00000075"></path></svg>
                  <input type="file" onChange={uploadImage} accept="image/*" className="d-none" />
                  </label>
                  <input
                    type="text"
                    value={text}
                    onChange={e=>setText(e.target.value)}
                    placeholder="Type a message..."
                    className="flex-grow border border-gray-300 rounded-lg py-3 ps-10 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                  <button
                    type="submit"
                    className="bg-blue-500 text-white px-4 py-[11px] rounded-lg hover:bg-blue-600 absolute right-[4px]"
                  >
                  <svg xmlns="http://www.w3.org/2000/svg" className="text-white text-[20px] w-[20px] " viewBox="0 0 45.6 45.6"><g><path d="M20.7,26.7a1.4,1.4,0,0,1-1.2-.6,1.6,1.6,0,0,1,0-2.4L42.6.5a1.8,1.8,0,0,1,2.5,0,1.8,1.8,0,0,1,0,2.5L21.9,26.1A1.6,1.6,0,0,1,20.7,26.7Z" fill="#fff"></path><path d="M29.1,45.6a1.8,1.8,0,0,1-1.6-1L19.4,26.2,1,18.1a1.9,1.9,0,0,1-1-1.7,1.8,1.8,0,0,1,1.2-1.6L43.3.1a1.7,1.7,0,0,1,1.8.4,1.7,1.7,0,0,1,.4,1.8L30.8,44.4a1.8,1.8,0,0,1-1.6,1.2ZM6.5,16.7l14.9,6.6a2,2,0,0,1,.9.9l6.6,14.9L41,4.6Z" fill="#fff"></path></g></svg>
                  </button>
                </form>
              </div>
            </div>
          </div>
        </div>
      </Layout>
    </>
  );
}
