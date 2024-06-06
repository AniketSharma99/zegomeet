import React, { useEffect, useContext, useState } from 'react'
import { ZegoUIKitPrebuilt } from '@zegocloud/zego-uikit-prebuilt';
import { useParams, useLocation } from 'react-router';
import { ZPContext } from '../context/ZPContext';
import { ZIM } from "zego-zim-web"
import AdLoader from './AdLoader';
import { environment } from '../environment/environments';
const Room = () => {
  const URL = environment.production
  const room = useParams();
  const userID = room?.userID?.replace(/-/g, '') || '';
  const roomID = room?.roomID?.replace(/-/g, '') || '';
  const location = useLocation();
  const [meetInfo, setMeetInfo] = useState("")
  const [timeEnd, setTimeEnd] = useState(false);
  const [loding, setLoding] = useState(true);
  const [message, setMessage]= useState('');
  const [groupCall, setGroupCall]= useState(false)
  const [bgBlack, setBgBlack] = useState(false);
  const [isMobile,setIsMobile] = useState(window.innerWidth)
  
  /////////////////getPrepped CDN ///////////////////////
  const logoWhite = "https://cdn.mastersunion.org/assets/GetPreppedLogoBlack.svg"
  const logoBlack = "https://cdn.mastersunion.org/assets/GetPreppedLogoWhite.svg"
  
  
  ////////////////For Timer///////////////////////////
  
  const [start, setStartTime] = useState(false)
  const [seconds, setSeconds] = useState(0);
  const [minutes, setMinutes] = useState(30);
  const [isEle, setIsEle] = useState(false);
  
  useEffect(() => {
    if (start) {
      let timer = setInterval(() => {
        setSeconds(prev => prev - 1);
        if (seconds === 0) {
          setMinutes(prev => prev - 1)
          setSeconds(59)
        }
        if (minutes === 0 && seconds === 0) {
          setStartTime(false)
          redirectUrl()
        }
        // console.log("timer is running2", seconds);
        
      }, 1000);

      return () => clearInterval(timer)
    }
    
  }, [start, seconds, minutes]);

  useEffect(() => {
    if (start && minutes >= 0) {
      const timerDiv = document.querySelector(".timerDiv") || document.createElement("div");
      timerDiv.className = "timerDiv";
      timerDiv.style.cssText = 'display: flex; align-items: center; justify-content: flex-start; padding: 10px 8px; color: rgba(255, 255, 255, 0.8); font-weight: 700; font-size: 25px; line-height: 18px; background: #313443; border-radius: 12px;';
      timerDiv.innerHTML = `<span> ${minutes < 10 ? "0" + minutes : minutes}:${seconds < 10 ? "0" + seconds : seconds}</span>`
      
      const timeElement = document.querySelector(".dIzgYQV4CBbzZxzJbwbS");
      
      if (!timeElement?.querySelector(".timerDiv")) {
        timeElement?.appendChild(timerDiv);
      }
    }
  }, [seconds, minutes])
  
  ////////////////////////////////////////////////////////
  
  const query = new URLSearchParams(location.search);
  const { zp, setZP } = useContext(ZPContext);
  
  //get name from query
  // const query = useQuery();
  const name = query.get("name");
  const baseURL = process.env.REACT_APP_BASE_URL;
  const redirectUrl = () => {
    try {
      fetch( URL+`/api/getCallInfo/${room.roomID}/${room.userID}`)
      // fetch(`https://get-prepped-backend.onrender.com/api/getCallInfo/${room.roomID}/${room.userID}`)
      .then(response => response.json())
      .then(data => {
          // Use the data from the API
          window.location.href = (data?.Data?.redirectLink)
        })
        .catch((error) => {
          
          console.error('Error:', error);
          // Handle any errors here
        });
    } catch (err) {
      console.log(err)
    }
  }
  
  const agendaCall = () => {
    try {
      fetch( URL+`/api/getCallInfo/${room.roomID}/${room.userID}`)
        .then(response => response.json())
        .then(data => {
          addAgenda(data?.Data?.call?.agenda ?? data?.Data?.call?.interviewAgenda?.agenda)
        })
        .catch((error) => {
          
          console.error('Error:', error);
          // Handle any errors here
        });
      } catch (err) {
        console.log(err)
      }
  }

  const addAgenda = (txt) => {
    const agendaDiv = document.createElement("div")
    agendaDiv.style.cssText = 'width: 100%; max-width: 70%; display: flex; align-items: center; justify-content: center; padding: 10px 40px; color: rgba(255, 255, 255, 0.8); font-weight: 400; font-size: 12px; line-height: 18px; background: rgb(49, 52, 67); border-radius: 1px;';
    //  agendaDiv.classList.add("agenda")
    agendaDiv.innerHTML = `<h1 style='display: -webkit-box; -webkit-line-clamp: 1; -webkit-box-orient: vertical; overflow: hidden;    margin: 0; font-size: 14px; font-weight: 700;'>Agenda : ${txt ?? "N/A"} </h1>`
    const ele = document.querySelector(".dIzgYQV4CBbzZxzJbwbS");
    console.log(ele, 'appending')
    ele?.appendChild(agendaDiv);
    console.log("tan tan", txt);
  }

  let myMeeting = async (element) => {
    console.log("calling the join room " )
    // generate Kit Token
    const appID = 681393858;
    const serverSecret = "d3d8a0f68de4c548c19eb54814ea6992";
    const kitToken = ZegoUIKitPrebuilt.generateKitTokenForTest(appID, serverSecret, roomID, userID, (name ? name : 'Enter Name'));

    // Create instance object from Kit Token.
    const zp = ZegoUIKitPrebuilt.create(kitToken);
    setZP(zp); //

    zp.addPlugins({ ZIM });

    var zim = ZIM.getInstance();

    zim.on('receiveRoomMessage',
      function (zim, { messageList, fromConversationID }) {
        console.log("messageList", messageList, fromConversationID);
        setStartTime(true)
        console.log("recivedmsg");
      }
    );

    // start the call
    zp.joinRoom({
      container: element,
      scenario: {
        mode: [ZegoUIKitPrebuilt.OneONoneCall], // To implement 1-on-1 calls, modify the parameter here to [ZegoUIKitPrebuilt.OneONoneCall].
      },
      maxUsers: 3,
      screenSharingConfig: {
        resolution: ZegoUIKitPrebuilt.ScreenSharingResolution_720P
    },

    onJoinRoom: () => {
        agendaCall()
        if (meetInfo?.call?.startedAt) {
          const timerT = new Date(meetInfo?.call?.startedAt)
          console.log("timerT", timerT);
          const currentTime = new Date();
          // Calculate the difference in minutes
          const differenceInMinutes = (currentTime - timerT) / (1000 * 60);
          
          if (differenceInMinutes < 30) {
            // Set remaining minutes here
            const remainingMinutes = 30 - differenceInMinutes;

            setMinutes(Math.floor(remainingMinutes));
            setStartTime(true)
            console.log(`Less than 30 minutes remaining: ${remainingMinutes} minutes`);
            console.log("running the loop", differenceInMinutes);
          }

        }
        console.log("onJoinRoom");
        
      },

      onInRoomTextMessageReceived: () => {
        console.log("alright its running", new Date());
      },

      onLeaveRoom: () => {
        setBgBlack(true)
        // Add your custom logic
        const button = document.querySelector(".IughcowXVrJ5wcOf6vH9");
        const homeButton = document.querySelector(".mCx2N1NwuMWObjjTeG0q");
        //create new button right after homeButton
        const newButton = document.createElement("button");
        newButton.innerHTML = "Give Feedback";
        newButton.style.cssText = "cursor:pointer;background-color:rgb(26, 115, 232);color:white;padding:15px 30px;margin-top:20px;font-weight:600;border:none;font-size:9px;border-radius:8px;";
        
        // now add it after homeButton
        homeButton.after(newButton);
        newButton.addEventListener("click", () => {
          redirectUrl()
        });
        if (button) {
          button.remove();
        }
        if (homeButton) {
          homeButton.remove();
        }
        
        console.log("onLeaveRoom");
      },
      branding: {
        logoURL: "https://cdn.mastersunion.org/assets/img/get-prepped.webp", // The branding LOGO URL.
      },
    });
  }
  const [content, setContent] = useState("");

  useEffect(() => {
    // Call your API
    fetch( URL+`/api/getCallInfo/${room.roomID}/${room.userID}`)
      .then(response => response.json())
      .then(data => {
        // Use the data from the API
        setMeetInfo(data?.Data)
        setMessage(data?.Message)
        setLoding(false)
        if(data?.Data != null){
          setContent(<div ref={myMeeting}style={{ width: '100vw', height: isMobile >= 767 ? '100vh' : 'calc(100vh - 65px)' }}></div>)
        }
      })
      .catch((error) => {
        console.error('Error:', error);
      });
      // myMeeting()
  }, []);

  useEffect(() => {
    if (meetInfo?.call?.meetingStatus === "completed") {
      // setTimeEnd(true)

    }

    if (meetInfo?.call?.isGroupSession) {
      setGroupCall(true)  
    }
    const endTime = new Date(meetInfo?.call?.endTime);
    const currentTime = new Date();

    if (currentTime > endTime) {
      // Current time is after end time
      console.log('The end time has passed.', endTime);
      // Perform your action here
      setTimeEnd(true)
    } else {
      if (meetInfo?.call?.agenda || meetInfo?.call?.interviewAgenda?.agenda) {
        console.log('The end time has not yet passed.', meetInfo?.call?.interviewAgenda?.agenda);
        setIsEle(true);
        // addingAgenda();
        addAgenda(meetInfo?.call?.agenda ?? meetInfo?.call?.interviewAgenda?.agenda);
      }
    }

    if (meetInfo?.call?.mentor?.id === room.userID) {
      // setIsMentor(true)
    }

    if (meetInfo?.call?.startedAt) {
      const timerT = new Date(meetInfo?.call?.startedAt)
      console.log("timerT", timerT);
      const currentTime = new Date();
      // Calculate the difference in minutes
      const differenceInMinutes = (currentTime - timerT) / (1000 * 60);
      console.log("loop", differenceInMinutes);
  
      if (differenceInMinutes < 30) {
        // Set remaining minutes here
        // const remainingMinutes = 30 - differenceInMinutes;
        // const wholeNumberPart = Math.floor(remainingMinutes);
        // setMinutes(wholeNumberPart);
        const remainingTotalSeconds = Math.floor((30 - differenceInMinutes) * 60);
        const remainingMinutes = Math.floor(remainingTotalSeconds / 60);
        const remainingSeconds = remainingTotalSeconds % 60;
        setMinutes(remainingMinutes)
        setSeconds(remainingSeconds)
        setStartTime(true)
        console.log(`Less than 30 minutes remaining: ${remainingMinutes} minutes`);
        console.log("running the loop", differenceInMinutes);
      } else {
        setTimeEnd(true)
      }


    }
    console.log('Timepass.', meetInfo?.call?.startedAt);
  }, [meetInfo]);

  useEffect(() => {
    console.log("adding agenda")
    if (isEle) {
      const ele = document.querySelector(".pOvRwHj19chJGkgemUH3");
      console.log(ele, "ele")
      var newDiv3 = document.createElement("div");
      newDiv3.className = "dQDNvqxeCXpZG5yOs9Ou";
      newDiv3.innerHTML = `
       <div style="
           display: flex;
           width: 100%;
           align-items: flex-start;
           font-size: 14px;
           margin-bottom: 10px;
           font-weight: 700;
           color: #141414;
           gap: 6px;
       "> 
           Meeting with : <span style=" font-weight: 500;
           display: -webkit-box;
           -webkit-line-clamp: 2;
           -webkit-box-orient: vertical;
           overflow: hidden;
           width: 210px;
           font-weight: 500;
           max-width: 100px
          //  color: #737373;
           "> ${meetInfo?.call?.mentor?.id === room.userID ? (meetInfo?.call?.mentee?.firstName + " " + meetInfo?.call?.mentee?.lastName) : (meetInfo?.call?.mentor?.firstName + " " + meetInfo?.call?.mentor?.lastName)}</span>
       </div>
    `;
      ele?.appendChild(newDiv3);

      var newDiv4 = document.createElement("div");
      newDiv4.className = "dQDNvqxeCXpZG5yOs9Ou";
      newDiv4.innerHTML = `
    <div style="
        display: flex;
        width: 100%;
        align-items: flex-start;
        font-size: 14px;
        margin-bottom: 10px;
        font-weight: 600;
        color: #141414;
        gap: 6px;
        max-width: 340px;
    "> 
     Agenda : <span style=" font-weight: 500;
        display: -webkit-box;
        -webkit-line-clamp: 2;
        -webkit-box-orient: vertical;
        overflow: hidden;
        width: 100%;
        color: #737373;
        max-width: calc(100% - 64px);">${(meetInfo?.call?.agenda )?? (meetInfo?.call?.interviewAgenda?.agenda)}</span>
    </div>
`;
      ele?.appendChild(newDiv4);
    }
  }, [isEle])

  ///////////For Mobile view//////////////

  // const handleResize = () => {
  //   setIsMobile(window.innerWidth);
  // };
  
  // useEffect(()=>{
    
  //   console.log("hariom", isMobile);
  // },[isMobile])

  // useEffect(() => {
  //   window.addEventListener('resize', handleResize);
  //   return () => {
  //     window.removeEventListener('resize', handleResize);
  //   };
  // }, []);

//////////////////////////////////////////////////////////


  return (
    <>
      {(meetInfo && !groupCall) ?  
        (
          <div className="myCallContainer" style={{ position: "relative" }}>
            {isMobile>= 767 ?
            <div style={{ position: "absolute", top: "20px", left: "2%" }}>
              <img src={bgBlack ? logoBlack : logoWhite } alt="" style={{ width: "45%" }} />
            </div>
            :
            <div style={{ height: "65px", paddingLeft:"20px", display: "flex" , alignItems: "center" }}>
          <img src={bgBlack ? logoBlack : logoWhite } alt="" style={{ width: "190px" }} />
         </div>
        }
            {content}
            {/* <div
              ref={myMeeting}
              style={{ width: '100vw', height: isMobile >= 767 ? '100vh' : 'calc(100vh - 65px)' }}
            >
            </div> */}
          </div>
        ) :

        <div style={{ display: "flex", justifyContent: "center", alignItems: "center", width: "100%", minHeight: "100vh", flexDirection: "column", gap: "20px" }}>
          <img src={logoWhite} alt="" style={{ width: "18%" }} />
          <h1 style={{ fontSize: "18px", fontWeight: "600", color: "#141414", textAlign: "center" }}>{loding ? <AdLoader /> : (groupCall ? "Invalid link please check " : message)}</h1>
        </div>

      }
    </>
  )
}

export default Room