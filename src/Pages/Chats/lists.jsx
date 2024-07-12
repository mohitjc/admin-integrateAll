import moment from "moment";
import React, { useEffect, useState } from "react";
import { LiaTrashAlt } from "react-icons/lia";
import methodModel from "../../methods/methods";
import FromNow from "../../components/Time/FromNow";

function Lists({ chats, onChatRoomClick, user, activeChat, isChat }) {
  return (
    <div className="">
      {chats?.length == 0 && (
        <div className="text-gray-600 text-center py-6">no chats.</div>
      )}
      <div className="py-4 max-h-[200px]  lg:max-h-[650px] overflow-y-auto pr-4 mt-4">
        {chats &&
          chats.map((chat) => {
            const sender = chat.user_details.find(
              (_user) => _user._id != user._id
            );
            return (
              <Chat
                chat={chat}
                onChatClick={onChatRoomClick}
                sender={sender}
                isActive={chat?.room_id == activeChat}
                isChat={isChat}
              />
            );
          })}
      </div>
    </div>
  );
}

export default Lists;

const Chat = ({ chat, onChatClick, sender, isActive, isChat }) => {
  let _count = chat.admin_chat_count;

  const [count, setCount] = useState(0);
  useEffect(() => {
    setCount(_count);
  }, [_count]);

  return (
    <>
      {chat && (
        <div className="">
          <div
            className={` ${
              isActive ? "bg-[#EB6A59] text-white" : "bg-white"
            } hover:bg-[#EB6A59] group hover:!text-gray-100 group  p-2 mb-3`}
          >
            <a
              onClick={() => {
                setCount(0);
                onChatClick(chat.room_details._id);
              }}
            >
              <div className="">
                <div className="flex items-center justify-between cursor-pointer">
                  <div className="flex items-center gap-2 ">
                    <div className="shrink-0">
                      <img
                        className="h-6 w-6  xl:h-12 xl:w-12 rounded-full object-cover"
                        src={methodModel.noImg(sender?.image)}
                        alt=""
                      />
                      {isChat && (
                        <span>
                          {chat?.issOnline ? (
                            <div class="bg-[#138d33] h-3 w-3 rounded-full"></div>
                          ) : (
                            <div class="bg-[#fdc809] h-3 w-3 rounded-full"></div>
                          )}
                        </span>
                      )}
                    </div>
                    <div className="">
                      <div className="">
                        <p className="xl:text-[15px] text-[12px] font-semibold">
                          {sender?.fullName}
                        </p>

                        <p className="xl:text-[12px] text-[10px] w-20 xl:w-32 line-clamp-1 ">
                          {chat?.room_details?.subject}
                        </p>
                      </div>
                    </div>
                  </div>
                  {count != null && count > 0 && !isActive && (
                    <div className="text-[12px]">{count}</div>
                  )}
                </div>

                <div className="flex justify-end text-[10px] shrink-0">
                  <FromNow date={chat.room_details?.createdAt} />
                </div>
              </div>
            </a>
          </div>
        </div>
      )}
    </>
  );
};
