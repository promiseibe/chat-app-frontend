import React from "react";
import { Row, Col, ListGroup } from "react-bootstrap";
import { useDispatch, useSelector } from "react-redux";
import { AppContext } from "../context/appContext";
import { useContext } from "react";
import { useEffect } from "react";
import { addNotifications, resetNotifications } from "../features/userSlice";
import "./Sidebar.css"
function Sidebar() {
    const user = useSelector((state) => state.user);
    const dispatch = useDispatch()
    const {socket, setMembers, members, setCurrentRoom, setRoom, privateMemberMsg, rooms, setPrivateMemberMsg, currentRoom} = useContext(AppContext);



    function joinRoom(room, isPublic = true) {
      if(!user) {
        return alert("please login");
      }
      socket.emit("join-room", room, currentRoom);
      setCurrentRoom(room);
      if(isPublic) {
        setPrivateMemberMsg(null);
      }

      // dispatch for notification
      dispatch(resetNotifications(room));

      

    }


    socket.off("notifications").on("notifications", (room) => {
        if(currentRoom != room)  dispatch(addNotifications(room));
      })

    useEffect(() => {

      function getRooms() {
      fetch("http://localhost:5001/rooms")
      .then((res) => res.json())
      .then((data) => setRoom(data))
      .catch((error) => {
        console.error("Error fetching rooms:", error);
        // Handle the error (e.g., show an error message to the user)
      });
    }

      if(user) {
     setCurrentRoom("general");
      getRooms();
     socket.emit("join-room", "general");
     socket.emit("new-user");
    }
   
    },[user, setCurrentRoom, setRoom, socket])
    
  

    socket.off("new-user").on("new-user", (payload) => {
      setMembers(payload);
    });

    function orderIds(id1, id2) {
      if(id1 > id2) {
        return id1 + "-" + id2;
      } else {
        return id2 + "-" + id1
      }
    }
    function handlePrivateMemberMsg(member) {
      setPrivateMemberMsg(member);
      const roomId = orderIds(user._id, member._id);
      joinRoom(roomId, false);
    }

    if(!user) {
      return <></>;
    }
    return(
        <>
        <div className="bs">

      
          <h2>Available rooms</h2>
          <ListGroup className="bss">
            {rooms.map((room, idx) => (
            <ListGroup.Item key={idx} onClick={() => joinRoom(room)} active = {room == currentRoom} style={{cursor: "pointer", display: "flex", justifyContent: "space-around"}}>
              {room} {currentRoom !== room && <span className="badge rounded-pill bg-primary">{user.newMessages[room]}</span>}
              </ListGroup.Item>
            
            ))}
          </ListGroup>  
          </div>
          <div className="bs mt-3">
          <h2>Members</h2>
         <ListGroup className="bss">
          {members.map((member) => (
          <ListGroup.Item key={member._id} style={{cursor: "pointer"}} active={privateMemberMsg?._id == member ?._id} onClick={() => handlePrivateMemberMsg(member)} disabled={member._id === user._id}>
        <Row className="p-3">
          <Col xs={2} className="member-status">
            <img src={member.picture} className="member-status-img" />
            {member.status == "online" ? <i className="fas fa-circle sidebar-online-status"></i> : <i className="fas fa-circle sidebar-offline-status"></i>}
          </Col>
          <Col xs={9}>
            {member.name}
            {member._id === user?._id && "(you)"}
            {member.status == "offline" && " (Offline)"}
          </Col>
          <Col xs={1}>
            <span className="badge rounded-pill bg-primary">{user.newMessages[orderIds(member._id, user._id)]}</span>
          </Col>
        </Row>
          </ListGroup.Item>
           ))}
         </ListGroup>
             </div>
       
    
         
        </>
    )
}

export default Sidebar;