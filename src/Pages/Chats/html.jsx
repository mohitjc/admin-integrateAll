import React, { useEffect, useRef, useState } from "react";
import Layout from "../../components/global/layout";
import "./style.scss";
import { Link } from "react-router-dom";
import { Tooltip } from "antd";
import { FiEdit3, FiPlus } from "react-icons/fi";
import { BsTrash3 } from "react-icons/bs";
import Table from "../../components/Table";
import SelectDropdown from "../../components/common/SelectDropdown";
import statusModel from "../../models/status.model";
import datepipeModel from "../../models/datepipemodel";
import shared from "./shared";
import ApiClient from "../../methods/api/apiClient";
import { useSelector } from "react-redux";
import { LiaEdit, LiaTrashAlt } from "react-icons/lia";
import { PiEyeLight } from "react-icons/pi";
import Lists from "./lists";
import Chat from "./chat";
import { IoSearchOutline } from "react-icons/io5";
import socketModel from "../../models/socketModel";
import loader from "../../methods/loader";
const Html = ({
  sorting,
  filter,
  edit,
  view,
  statusChange,
  pageChange,
  count,
  deleteItem,
  clear,
  filters,
  setFilter,
  loaging,
  data,
  changestatus,
  isAllow,
  total = { total },
}) => {
  const user = useSelector((state) => state.user);
  const [img, setImg] = useState("");
  const [message, setMessage] = useState({
    type: "",
    message: "",
  });
  const [chatMessages, setChatMessages] = useState([]);
  const [chatRooms, setChatRooms] = useState();
  const [chatRoomId, setChatRoomId] = useState("");
  const [activeChat, setActiveChat] = useState();
  const [showEmojis, setShowEmojis] = useState(false);
  const [search, setSearch] = useState("");

  let ar = sessionStorage.getItem("activeRooms");
  const activeRooms = useRef(ar ? JSON.parse(ar) : []);
  const currectChat = useRef();
  const messages = useRef([]);

  const chatScroll = () => {
    // Scroll to the bottom after sending a message
    var chatBox = document.getElementById("chat-box");
    if (chatBox) chatBox.scrollTop = chatBox.scrollHeight;
  };

  const handleSendMessage = () => {
    let value = {};
    if (message) {
      value = {
        room_id: chatRoomId,
        type: message.type,
        content: message.message || img,
        user_id: user?._id,
      };
      console.log("VALUE", value);
      socketModel.emit("send-message", value);
      setMessage({ message: "", type: "" });
      setImg("");
      setShowEmojis(false);
    }
  };

  const handleEmojiClick = ({ emoji }) => {
    const _value = message.message;
    let _message =
      message.message.length > 0 ? `${_value} ${emoji}` : `${emoji}`;
    setMessage({ message: _message });
    // setShowEmojis(false);
  };

  const getChatRoomsList = (p = {}) => {
    let f = { ...p };
    if (search) {
      f = { search: search };
    }
    ApiClient.get("chat/room-members", f).then((res) => {
      if (res.success) {
        console.log("res", res);
        setChatRooms(res.data.data);
      }
    });
  };
  const getChatMessages = (id) => {
    // loader(true);
    ApiClient.get("chat/messages", { room_id: id }).then((res) => {
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

  const getActiveChat = (id) => {
    ApiClient.get("chat/room-members", { room_id: id }).then((res) => {
      if (res.success) {
        setActiveChat(res.data.data?.[0]);
      }
    });
  };

  const uploadImage = async (e) => {
    let url = "upload/multiple-images";
    let files = e.target.files;
    if (files?.length > 1) {
      url = "upload/multiple-images";
    }
    let images = [];
    // if (img) images = img;
    ApiClient.multiImageUpload(url, files, {}, "files").then((res) => {
      console.log("res", res);
      if (res.files) {
        let image = res.files.map((itm) => itm.fileName);
        if (files?.length == 1) {
          setImg(image[0]);
          setMessage({ message: image[0], type: "IMAGE" });
          // result({ event: "value", value: image[0] });
        } else {
          images = [...images, ...image];
          // setImg(images);
          // result({ event: "value", value: images });
        }
      }
    });
  };

  const handleChatClick = (id) => {
    if (id) {
      setChatRoomId(id);
      currectChat.current = id;
    }
  };

  useEffect(() => {
    if (chatRoomId != "") {
      let value = {
        room_id: chatRoomId,
        user_id: user?._id,
      };

      if (!activeRooms.current.includes(chatRoomId)) {
        console.log("activeRooms", activeRooms);
        activeRooms.current.push(chatRoomId);
        sessionStorage.setItem(
          "activeRooms",
          JSON.stringify(activeRooms.current)
        );
        socketModel.emit("join-room", value);
      }
      socketModel.emit("unread-count", value);

      getChatMessages(chatRoomId);
      getActiveChat(chatRoomId);
    }
  }, [chatRoomId]);

  useEffect(() => {
    socketModel.on("receive-message", (data) => {
      console.log("data", data);
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
      getChatRoomsList();
    });
  }, []);

  const handleClearSearch = () => {
    setSearch("");
    ApiClient.get("chat/room-members").then((res) => {
      if (res.success) {
        setChatRooms(res.data.data);
      }
    });
  };

  useEffect(() => {
    {
      getChatRoomsList();
    }
  }, []);

  return (
    <Layout>
      <div className="flex flex-wrap justify-between items-center gap-y-4">
        <div>
          <h3 className="text-2xl font-semibold text-[#111827]">
            {" "}
            {shared.title}
          </h3>
          <p className="text-sm font-normal text-[#75757A]">
            Here you can see all about your {shared.title}
          </p>
        </div>
      </div>

      <div>
        <a
          onClick={() => {
            getChatRoomsList({ quickChat: false });
            setChatRoomId("");
          }}
        >
          Quick Chats
        </a>
        <a
          onClick={() => {
            getChatRoomsList({ quickChat: true });
            setChatRoomId("");
          }}
          className="ms-2"
        >
          Notification Messages
        </a>
      </div>

      <div className="shadow-box w-full bg-white rounded-lg mt-6">
        <div className="">
          <div className="grid grid-cols-12 gap-4  ">
            {chatRooms?.length == 0 && !search && (
              <div className="col-span-12 h-[400px] bgs_starts flex items-center justify-center">
                <div className="w-52 mx-auto">No Chats.</div>
              </div>
            )}

            <div className="col-span-12 md:col-span-5 2xl:col-span-3">
              <div className="bg-gray-100 p-6 h-full">
                <form
                  className="flex items-center max-w-sm"
                  onSubmit={(e) => {
                    e.preventDefault();
                    filter();
                  }}
                >
                  <label for="simple-search" className="sr-only">
                    Search
                  </label>
                  <div className="relative w-full">
                    <input
                      type="text"
                      id="simple-search"
                      value={search}
                      onChange={(e) => {
                        setSearch(e.target.value);
                      }}
                      className="bg-gray-50 border border-gray-300 text-gray-900 text-sm  h-10 focus:ring-orange-500 focus:border-[#EB6A59]block w-full ps-10 p-2.5  dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-orange-500 dark:focus:border-orange-500 pr-10"
                      placeholder="Search..."
                      onKeyDown={(e) => {
                        if (e.key === "Enter") {
                          e.preventDefault();
                          getChatRoomsList();
                        }
                      }}
                    />
                    {search && (
                      <i
                        className="fa fa-times absolute right-4 top-1/2 -translate-y-1/2 text-gray-500 text-sm"
                        aria-hidden="true"
                        onClick={handleClearSearch}
                      ></i>
                    )}
                  </div>
                  <button
                    type="submit"
                    className="p-2.5 text-sm font-medium h-10 text-white  border border-[#EB6A59] focus:ring-4 focus:outline-none focus:ring-blue-300 dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800"
                  >
                    <IoSearchOutline
                      onClick={() => {
                        getChatRoomsList();
                      }}
                    />
                  </button>
                </form>
                <Lists
                  user={user}
                  chats={chatRooms}
                  onChatRoomClick={(id) => {
                    handleChatClick(id);
                  }}
                  activeChat={chatRoomId}
                />
              </div>
            </div>

            {chatRoomId != "" ? (
              <Chat
                user={user}
                activeChat={activeChat}
                onSendClick={handleSendMessage}
                onInputChange={(e) => {
                  setMessage({ message: e.target.value, type: "TEXT" });
                }}
                uploadImage={uploadImage}
                message={message.message}
                hasImage={img}
                chatMessages={chatMessages}
                onEmojiIconClick={() => {
                  setShowEmojis(!showEmojis);
                }}
                onEmojiClick={handleEmojiClick}
                showEmojis={showEmojis}
              />
            ) : (
              <></>
            )}
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default Html;
