import React from "react";
import { connect } from "react-redux";
import { stateMapper, store } from "../store/store.js";
import {ClimbingBoxLoader,PacmanLoader} from 'react-spinners';
import { css } from '@emotion/core';
import {BrowserRouter as Router, Route,Link,Redirect} from 'react-router-dom';

var status;
var TwitterPostId;
var postId;
var thisPostUrl;
var isSomethingChanged;
var user;


const override = css`
display: block;
margin:25px 25px 25px 200px;
border-color: red;
`;

class ManagePostComponent extends React.Component{
    
    constructor(props){
        super(props);
        this.state={
            isPostDeleted : false,
            isPostTweeted : false,
            loaded : false,
            loading:true
        }
        this.handleDelete=this.handleDelete.bind(this);
        this.postOnTwitter=this.postOnTwitter.bind(this);
       
        
        this.deleteFromTwitter=this.deleteFromTwitter.bind(this);
       
    }
    componentWillMount(){
       
        store.dispatch({
            type: "FETCH_ONE_POST",
            data : this.props.match.params.postId
          });
        
        user=localStorage.getItem('user');
    }
  
  componentDidMount(){
   
      if(this.props.singlePost){
      status=this.props.singlePost.Caption;
      }
      console.log(status);
      postId=this.props.match.params.postId;
  }
  
 handleDelete(){
   
   if(this.props.singlePost.postedOnTwitter){
    store.dispatch({
        type : 'DELETE_FROM_TWITTER',
        twitterPostId : this.props.singlePost.postIdTwitter,
    })
   }
   store.dispatch({
    type : 'DELETE_POST',
    data : this.props.match.params.postId
    } )
   this.setState({
       isPostDeleted : true
   })
   

 }

  redirect = () => {
      return <Redirect to="/dashboard"/>
  }

 postOnTwitter(event){
  
      store.dispatch({
          type : 'POST_TO_TWITTER',
          data : this.props.singlePost.Caption
      })
 }

 postCreatedTwitter(){
        if(this.props.TwitterPosts){
            TwitterPostId=this.props.TwitterPosts.id_str;
       console.log(TwitterPostId)
       this.updateTwitterId();
        }
       
     
     
 }
 updateTwitterId(){
     store.dispatch({
         type : 'UPDATE_TWITTER_ID',
         postId : postId,
         twitterPostId : TwitterPostId
     })
    
    
 }
 deleteFromTwitter(){
    if(this.props.singlePost.postIdTwitter){
        store.dispatch({
            type : 'DELETE_FROM_TWITTER',
            twitterPostId : this.props.singlePost.postIdTwitter,
            parsePostId : postId
        })
    }
  
 }
 renderComponent = () => {
 
    return(
        <div class='col-md-9'>    
                <textarea className='form-control'
                        rows='7'
                        cols='50'
                      value={this.props.singlePost&&this.props.singlePost.Caption} 
                      >
                </textarea><br></br>
            {this.props.usersocialaccounts.isTwitterConnected?
            (this.props.singlePost&&this.props.singlePost.postedOnTwitter?<button  className='btn btn-danger' onClick={this.deleteFromTwitter}>Delete From Twitter</button>:<button  className='btn btn-info' onClick={this.postOnTwitter}>Post on twitter</button>)
            :null}
            {this.props.usersocialaccounts.isInstagramConnected?
            (this.props.singlePost&&this.props.singlePost.postedOnInstagram?<button  className='hredbtn hredbtnfull'>Delete From Instagram</button>:<button>Post on Instagram</button>)
            :null}
            {this.props.usersocialaccounts.isFacebookConnected?
            (this.props.singlePost&&this.props.singlePost.postedOnFacebook?<button className='hredbtn hredbtnfull'>Delete From Facebook</button>:<button>Post on Facebook</button>)
            :null}  
            <br></br>
            <br></br>
            <button className='btn btn-danger' onClick={this.handleDelete}>Delete Post</button>
            {this.state.isPostDeleted && this.redirect()}
        </div>
         
       
    )
  
    
 }
 
  
    render(){
        if(this.props.singlePost&& !this.props.singlePost.Caption) {
            return (
              <div className="col-md-9">
                <div className="row">
               <PacmanLoader
               css={override}
               sizeUnit={"px"}
               size={60}
               color={'#123abc'}
               loading={this.state.loading}
             />
             <h3 className="animated slideInRight" style={{marginLeft:230, marginTop:70}}>Loading Post</h3>
             </div>
             </div>)
           } else {
        return(
            <div>
                {this.renderComponent()}
                {this.props.TwitterPosts?this.postCreatedTwitter():null}
            </div>
             
           
        )
    }
    }
}

let ManagePost=connect(stateMapper)(ManagePostComponent);

export default ManagePost;