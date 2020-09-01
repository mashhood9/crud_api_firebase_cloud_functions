import * as functions from 'firebase-functions';


import * as admin from 'firebase-admin'


import * as express from 'express'


import * as bodyParser from 'body-parser'




admin.initializeApp(functions.config().firebase);



/*const app=express()


const main=express()



main.use('/Myapi',app)


main.use(bodyParser.json())


main.use(bodyParser.urlencoded({extended:false}))



const db=admin.firestore();
const userCollection = 'users';


export const webApi=functions.https.onRequest(main)




interface Product 


{


    productName:string,


    productPrice:string


}



app.post('/saveProduct',async(req,res)=>{



const product:Product={



    productName:"Bag",


    productPrice:"1000"


}



await db.collection("productOnSale").add(product)



})



interface User {
    firstName: String,
    lastName: String,
    email: String,
    areaNumber: String,
    department: String,
    id:String,
    contactNumber:String
}

// Create new user
app.post('/users', async (req, res) => {
    try {
        const user: User = {
            firstName: req.body['firstName'],
            lastName: req.body['lastName'],
            email: req.body['email'],
            areaNumber: req.body['areaNumber'],
            department:req.body['department'],
            id:req.body['id'],
            contactNumber:req.body['contactNumber']
        }

        const newDoc = await db.collection(userCollection).add(user);
        res.status(201).send(`Created a new user: ${newDoc.id}`);
    } catch (error) {
        res.status(400).send(`User should cointain firstName, lastName, email, areaNumber, department, id and contactNumber!!!`)
    }
});


app.get('/contacts', (req, res) => {
    firebaseHelper.firestore
        .backup(db, userCollection)
        .then(data => res.status(200).send(data))
        .catch(error => res.status(400).send(`Cannot get contacts: ${error}`));
})



// Delete a user
app.delete('/users/:userId', (req, res) => {
    db.collection(userCollection).doc(req.params.userId).delete()
    .then(()=>res.status(204).send("Document successfully deleted!"))
    .catch(function (error) {
            res.status(500).send(error);
    });
})

// Update user
app.put('/users/:userId', async (req, res) => {
    await db.collection(userCollection).doc(req.params.userId).set(req.body,{merge:true})
    .then(()=> res.json({id:req.params.userId}))
    .catch((error)=> res.status(500).send(error))

});*/

const db = admin.firestore(); // Add this

const app = express();
const main = express();

main.use('/api/v1', app);
main.use(bodyParser.json());

export const webApi = functions.https.onRequest(main);

app.get('/warmup', (request, response) => {

    response.send('Warming up friend.');

});

app.post('/fights', async (request, response) => {
  try {
    const { winner, losser, title } = request.body;
    const data = {
      winner,
      losser,
      title
    } 
    const fightRef = await db.collection('fights').add(data);
    const fight = await fightRef.get();

    response.json({
      id: fightRef.id,
      data: fight.data()
    });

  } catch(error){

    response.status(500).send(error);

  }
});

app.get('/fights/:id', async (request, response) => {
  try {
    const fightId = request.params.id;

    if (!fightId) throw new Error('Fight ID is required');

    const fight = await db.collection('fights').doc(fightId).get();

    if (!fight.exists){
        throw new Error('Fight doesnt exist.')
    }

    response.json({
      id: fight.id,
      data: fight.data()
    });

  } catch(error){

    response.status(500).send(error);

  }
});


app.get('/fights', async (request, response) => {
    try {
  
      const fightQuerySnapshot = await db.collection('fights').get();
      const fights: { id: string; data: FirebaseFirestore.DocumentData; }[] = [];
      fightQuerySnapshot.forEach(
          (doc) => {
              fights.push({
                  id: doc.id,
                  data: doc.data()
              });
          }
      );
  
      response.json(fights);
  
    } catch(error){
  
      response.status(500).send(error);
  
    }
  
  });
  





app.delete('/fights/:id', async (request, response) => {
  try {

    const fightId = request.params.winner;

    if (!fightId) throw new Error('id is blank');

    await db.collection('fights')
        .doc(fightId)
        .delete();

    response.json({
        id: fightId,
    })


  } catch(error){

    response.status(500).send(error);

  }

});