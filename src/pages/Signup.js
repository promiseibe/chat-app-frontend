import React, { useState } from "react";
import {Col, Container, Button, Form, Row, } from 'react-bootstrap';
import {useSignupUserMutation} from "../services/appApi";
import { Link, useNavigate } from "react-router-dom";
import "./Signup.css";
import passport from "../assets/passport.jpg";



function Signup() {
    const[email, setEmail] = useState("");
    const[password, setPassword] = useState("");
   
    const[name, setName] = useState("");
    const [signupUser, {isLoading, error}] = useSignupUserMutation();
   const navigate = useNavigate();
// image upload states
const [image, setImage] = useState(null);
const [uploadingImg, setUploadingImg] = useState(false);
const [imagePreview, setImagePreview] = useState(null);
    
function validateImg(e) {
    const file = e.target.files[0];
    if(file.size > 1048576) {
       return alert("Max file size is 1mb") 
    } else {
        setImage(file);
        setImagePreview(URL.createObjectURL(file))
    }
    }
    async function uploadImage() {
        const data = new FormData();
        data.append("file", image);
        data.append("upload_preset", "mhycr4m0");
        try {
            setUploadingImg(true);
            let res = await fetch("https://api.cloudinary.com/v1_1/djpjicmhj/image/upload", {
                method: "post",
                body: data
            })
            const urlData = await res.json();
            setUploadingImg(false);
            return urlData.url
        } catch(error) {
            setUploadingImg(false)
            console.log(error)
        }
    }
    async function handleSignup(event) {
        event.preventDefault();
        if(!image) return alert("Please upload your Profile picture");
        const url = await uploadImage(image);
        console.log(url)
        // signup the user
        signupUser({name, email, password, picture: url}).then(({data}) => {
          if(data) {
            console.log(data)
            navigate("/chat")
          }
        })
    }

return (
        <Container className="p-3 ">
        <Row>
           
            <Col md={7} className="d-flex align-items-center justify-content-center flex-direction-column"> 
    
<Form style={{width: "80%", maxWidth: 500, backgroundColor: "white"}} className="bs mb-2" onSubmit={handleSignup}>
    <h2 className="text-center text-light">Create account</h2>
    <div className="signup-profile-pic_container">
        <img src={imagePreview || passport} alt="Profile pic" className="signup-profile-pic"/>
    <label htmlFor="image-upload" className="image-upload-label">
        <i className="fas fa-plus-circle add-picture-icon"></i>
    </label>
    <input type="file" id="image-upload" hidden accept="image/png image/jpeg" onChange={validateImg} />
    </div>
    {error && <p className="alert alert-danger">{error.data}</p>}
<Form.Group className="mb-3" controlId="formBasicName">
        <Form.Label>Full name</Form.Label>
        <Form.Control type="text" placeholder="Your name"  onChange={(e) => {setName(e.target.value)}} value={name}/>
      </Form.Group>
      <Form.Group className="mb-3" controlId="formBasicEmail">
        <Form.Label>Email address</Form.Label>
        <Form.Control type="email" placeholder="Enter email"  onChange={(e) => {setEmail(e.target.value)}} value={email}/>
        <Form.Text className="text-muted">
          We'll never share your email with anyone else.
        </Form.Text>
      </Form.Group>

      <Form.Group className="mb-3" controlId="formBasicPassword">
        <Form.Label>Password</Form.Label>
        <Form.Control type="password" placeholder="Password"  onChange={(e) => {setPassword(e.target.value)}} value={password}/>
      </Form.Group>
      
      <Button variant="primary" type="submit">
       {uploadingImg || isLoading ? "Signing you up..." : "Signup"}
      </Button>
      <div className="py-4">
        <p className="text-center">Already have an Account ? <Link to="/login">Login Here</Link> </p>
      </div>
    </Form> 
    </Col>  
    <Col md={5} className="signup_bg"></Col>
     </Row>
       </Container>
    

    )
}

export default Signup;