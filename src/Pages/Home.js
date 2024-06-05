import React, { useEffect, useState, useContext } from 'react'
import '../App.css'
import { useNavigate, useLocation } from 'react-router';
import { v4 as uuidv4 } from 'uuid';
import Pic from "../../src/assets/Pic"
import { ZPContext } from '../context/ZPContext';

const Home = () => {
  const [name, setName] = useState();
  const [disabled, setDisabled] = useState(true);
  const navigate = useNavigate();
  const location = useLocation();
  const { zp } = useContext(ZPContext);

  const instantMeet = () => {
    navigate(`/room/${uuidv4()}/${uuidv4()}?name=${name}`)

  }

  useEffect(() => {
    if (location.pathname === "/" && zp) {
      zp.destroy()
    }
  }, [location.pathname])


  useEffect(() => {
    if (!name) {
      setDisabled(true)
    } else {
      setDisabled(false)
    }
  }, [name])

  return (
    <div className='App'>
      <div style={{ width: "100%", display: "flex", flexDirection: "column", justifyContent: "center", alignItems: "center", rowGap: "5px", height: "100vh" }}>
        <div style={{ width: "100%" }}>
          <Pic />
        </div>
        <div>
          {/* <h1>Get a Link you can share</h1> */}
         <h1>
           Page Not Found Error (404)
          </h1> 
        </div>
        <div>
          {/* Click <strong>Start an instant meeting</strong> to get a link you can send to anyone */}
          Please check your url or link.
        </div>
        <div style={{ display: "flex", flexDirection: "column", alignItems: "center", rowGap: "10px" }}>

          <div>
            <div style={{ display: "flex", alignItems: "center", justifyContent: "center", flexDirection: "row", margin: "20px 0px" }}>
              {/* <input
                placeholder='Enter Your Name'
                type='text'
                value={name}
                onChange={(e) => setName(e.target.value)}
                style={{
                  border: "1px solid rgb(187 187 187)",
                  padding: "17px 20px",
                  outline: "none",
                  borderRadius: "6px",
                  marginRight: "5px",
                }}
              /> */}

              {/* <button
                id='start-meet'
                disabled={disabled}

                onClick={instantMeet}
              >
                Start an instant meeting
              </button> */}
            </div>
            {/* <div style={{ display: "flex", alignItems: "center", justifyContent: "center" }}>
            <div>
              <input placeholder='Enter Room ID' type='text' value={roomID} onChange={(e) => setRoomId(e.target.value)} style={{ borderRight: '0', padding: '10px', border: '1px solid #000', outline: 'none' }}></input>

            </div>
            <div>
              <button style={{ backgroundColor: "gray", color: "white", padding: "9px 30px", fontWeight: 600, border: "none", fontSize: "18px" }} onClick={handleJoin}>Join</button>
            </div>

          </div> */}

          </div>
        </div>
      </div>

    </div>
  )
}

export default Home