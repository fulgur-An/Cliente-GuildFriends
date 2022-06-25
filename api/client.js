let grpc = require("grpc");
var chat = require("./protos/chat_pb.js");
var chatService = require("./protos/chat_grpc_pb.js");
var readline = require("readline");

var rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});

let users;

async function SendMessage(input) {
  console.log('hola desdse el cliente');
  var client = new chatService.ChatServiceClient(
    'localhost:50051', grpc.credentials.createInsecure()
  )

  var call = client.send(request, (err, res) => {
    if (!err) {
      console.log("respuesta: "+res.getResult());
    }
    else {
      console.error(err);
    }
  });

  call.on("data", response => {
    console.log(response.getResult());
  })
  
  call.on("error", error => {
    console.error(error.details);
  });

  call.on("end", ()=>{
      console.log("Cliente: FIN petición mensaje!"); 
  });

  var request = new chat.RequestMessage();

  var data = new chat.Message();
  data.setUsername(users.user_name);
  console.log(input);
  data.setText(input);
  request.setMessage(data);
  call.write(request);
  call.end();
}


async function JoinServer() {
  console.log('tratando de conectarse');
  var client = new chatService.ChatServiceClient(
    'localhost:50051', grpc.credentials.createInsecure()
  )

  
  if (users.user_name != null || users.user_name === '') {
    


    var call = client.join(request, (err, res) => {
      if (!err) {
        console.log("respuesta: "+res.getResult());
      }
      else {
        console.error(err);
      }
    })

    call.on("data", response => {
      console.log(response.getResult());
      const messagesArea = document.getElementById('messagesAreas');
      messagesArea.innerHTML = `${response.getResult}`
    });

    call.on("error", error => {
      console.error(error.details);
    });

    call.on("end", ()=>{
        console.log("Cliente: FIN petición!"); 
    });

    var request = new chat.RequestJoin();
  
    var data = new chat.User();
    data.setName(users.user_name);
    data.setId(users.id);
    request.setUser(data);
    call.write(request);
    call.end();
  }
  else
  {
    console.log('is not username');
  }

  
}

function FillName(user) {
  console.log(llenando);
  users = user;
  JoinServer();
}

function FillMessage(message) {
  SendMessage(message);
}

// rl.question("What's ur name? ", answer => {
//   username = answer;
//   JoinServer();
// });



// rl.on("line", (input) => {
//   console.log("write a message");
//   SendMessage(input);
// })  


export default function FillNameExport(user){
  FillName(user);
}