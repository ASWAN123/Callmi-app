import React, { useContext, useEffect } from 'react'
import { useParams } from 'react-router-dom'
import { Peer } from "peerjs";
import uuid from "uuid-random";
import { roomContext } from './contextRoom';
import firebase from 'firebase/compat/app' ;

function Home() { 
    let {data  ,  db , userName } = useContext(roomContext)
    let { id } = useParams() ; 
    let users = data?.find((doc) => doc.id == id)?.users;
    console.log(users)
    let peer ;
    useEffect(() => {
        peer = new Peer(uuid())
        let newusers = users?.map((user) => {
            if(user.name  == userName ){
                user.peerID = peer._id ;
                return user
            }
            return user 
        })
        let update  = db.collection("callmi").doc(id).update({users:newusers})
        
    } ,  [])



    useEffect(() => {
        if(users.length ==  1) return 
        let user = users.find(user => user.name === userName)
        if( user.admin == true) {
            const conn = peer.connect(users?.find(user => user.name !== userName).peerID );
            console.log(conn)
        }else{
            peer.on('connection', function(conn) { 
                console.log(conn)
             });
        }
    } ,  [users])

    

    





    return (
        <div className='flex flex-col items-center'>
            <p>{id} : room id </p>
            <p> {userName} : this  is  my  name </p>
        </div>
    )
}

export default Home