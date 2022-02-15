async function tweetCreate(){

  $(".create").hide();
  $("#textnew").show();
  $("#savebuttons").show();
  $("#savebuttons"+" .savenew").on("click", function(){
    tweetNew()});
  $("#savebuttons"+" .cancelnew").on("click", function(){
    tweetCancelNew()});

}

async function tweetNew(){

  let text = $("#textnew").val();

  const result = await axios({
    method: "post",
    url: "https://comp426-1fa20.cs.unc.edu/a09/tweets/",
    withCredentials: true,
    data: { 
      "body": text,
    }
    
  });

  //$("#textnew").text(text);

  tweetCancelNew();

}

async function tweetCancelNew(){

  $(".create").show();
  $("#textnew").hide();
  $("#savebuttons").hide();
  Tweeter();

}

async function tweetEdit(id){

  let element = await tweetFinder(id.target.value);
  $("#textbody"+id.target.value).hide();
  $("#mybuttons"+id.target.value).hide();
  $("#savebuttons"+id.target.value).show();
  $("#textedit"+id.target.value).show().val(element.body);
  $("#savebuttons"+id.target.value+" .save").on("click", function(){
    tweetUpdate(id, element)});
  $("#savebuttons"+id.target.value+" .cancel").on("click", function(){
    tweetCancelUpdate(id)});

}

async function tweetCancelUpdate(id){

  $("#textbody"+id.target.value).show();
  $("#mybuttons"+id.target.value).show();
  $("#savebuttons"+id.target.value).hide();
  $("#textedit"+id.target.value).hide();

}


async function tweetUpdate(id, element){

  element.body = $("#textedit"+id.target.value).val();

  const result = await axios({
    method: "put",
    url: "https://comp426-1fa20.cs.unc.edu/a09/tweets/"+element.id,
    withCredentials: true,
    data: { 
      "body": element.body,
    }
    
  });

  $("#textbody"+id.target.value).text(element.body);

  tweetCancelUpdate(id);

}

async function tweetDelete(id){

  let element = await tweetFinder(id.target.value);
  const result = await axios({
    method: "delete",
    url: "https://comp426-1fa20.cs.unc.edu/a09/tweets/"+element.id,
    withCredentials: true,
 });
 Tweeter();
}

async function tweetFinder(id) {

  const result = await axios({
    method: 'get',
    url: 'https://comp426-1fa20.cs.unc.edu/a09/tweets/' + id,
    withCredentials: true,
  });
  if (result.status != 200){
    return null;
  }
  return result.data;
}

async function tweetLike(id) {
   
   let element = await tweetFinder(id.target.value);
   if (element == null){
     return;
   }
   let likeUrl = "/like";
   if (element.isLiked){
    likeUrl = "/unlike";
   }
   const result = await axios({
     method: "put",
     url: "https://comp426-1fa20.cs.unc.edu/a09/tweets/"+element.id + likeUrl,
     withCredentials: true,
   });
   Tweeter();
}

async function tweetReply(id) {

  let element = await tweetFinder(id.target.value);
  let text = prompt("Enter tweet:");

   const result = await axios({
     method: "post",
     url: "https://comp426-1fa20.cs.unc.edu/a09/tweets",
     withCredentials: true,
     data: {
       "type": "reply",
       "parent": element.id,
       "body": text,
     }
   })
   Tweeter();
}

async function tweetRetweet(id) {

  let element = await tweetFinder(id.target.value);
  const result = await axios({
    method: "post",
    url: "https://comp426-1fa20.cs.unc.edu/a09/tweets/",
    withCredentials: true,
    data: {
      "type": "retweet",
      "parent": element.id,
      "body": element.body,
    }
  })
  Tweeter();
}

async function Tweeter() {
  const result = await axios({
      method: 'get',
      url: 'https://comp426-1fa20.cs.unc.edu/a09/tweets',
      withCredentials: true,
  });
  let tweetsContent = "<p class='test'></p>";
  tweetsContent += `<div><textarea id="textnew" style="display:none"></textarea>`;
  tweetsContent += `<div id="savebuttons" style="display:none"><button class="savenew">Save</button>`;
  tweetsContent += `<button class="cancelnew">Cancel</button></div></div>`;
  tweetsContent += `<button type="submit" class="create">New Tweet</button>`;
  for (let i = 0; i < 50; i++) {
    let element = result.data[i];
    let li = "<li class='content'>";
    li += `<h5>${element.author}</h5>`;
    li += `<div class="body" id="textbody${element.id}">   ${element.body}</div>`;
    if (element.isMine){
      li += `<textarea id="textedit${element.id}" style="display:none"></textarea>`
      li += `<div id="savebuttons${element.id}" style="display:none"><button class="save" value=${element.id}>Save</button>`
      li += `<button class="cancel" value=${element.id}>Cancel</button></div>`
      li += `<div id="mybuttons${element.id}"><button class="edit" value=${element.id}>Edit</button>`;
      li += `<button class="delete" value=${element.id}>Delete</button></div>`;
    }
    li += `<p><h1>Likes: ${element.likeCount} `;
    li += `<button class="like" value=${element.id}>Like</button></h1>`;
    li += `<h1>Replies: ${element.replyCount} `;
    li += `<button class="reply" value=${element.id}>Reply</button></h1>`;
    li += `<h1>Retweets: ${element.retweetCount} `;
    li += `<button class="retweet" value=${element.id}>Retweet</button></h1>`;
    li +=" </p></li>";
    tweetsContent += li;
  }
  $("#tweets").html(tweetsContent);

}

async function Setup(){

  $(document).on("click", ".like", tweetLike);
  $(document).on("click", ".reply", tweetReply);
  $(document).on("click", ".retweet", tweetRetweet);
  $(document).on("click", ".delete", tweetDelete);
  $(document).on("click", ".edit", tweetEdit);
  $(document).on("click", ".create", tweetCreate);
  Tweeter();

} 

Setup();