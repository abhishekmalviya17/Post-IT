import config from "../../config.js";
const HEADERS = {
    "X-Parse-Application-Id": "postit",
    "Content-Type": "application/json"
};


export default function fetchOnePost(store,action) {

    

    let params = encodeURI(`where={"objectId": "${action.data}"}`);
    let url = `${config.url}/parse/classes/UserPosts?${params}`;

    fetch(url, {
        method: "get",
        headers: HEADERS
    })
    .then(data => data.json())
    .then(result => {
        store.dispatch({
            type:"ONE_POST_FETCHED",
            data:result
        })
    })
    .catch(err => console.log(err));
}