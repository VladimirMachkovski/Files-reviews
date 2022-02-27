import React from "react";
import './style.css';
import 'bootstrap/dist/css/bootstrap.min.css';
 export const App = ()=>{ 
let data = null;
function populateTable(data){
  var table = document.getElementById('table').getElementsByTagName('tbody')[0];
  
  for(let i = 0; i<data.length - 1;i++){
    var tr = document.createElement("tr");
    var text = document.createElement('td');
    var rating = document.createElement('td');
    var date = document.createElement('td');

    text.innerHTML=data[i].reviewText;
    rating.innerHTML=data[i].rating;
    date.innerHTML=data[i].reviewCreatedOnTime;

    tr.appendChild(text);
    tr.appendChild(rating);
    tr.appendChild(date);
    table.appendChild(tr);

    document.querySelector('.show-json').style.display = 'block'
  }

}
  const showJson = ()=>{
    debugger;
    var table = document.getElementById('table');
    if (table !== null){
      table.style.display = "none"
    }
    var json_space = document.getElementById('json_space');
    if (json_space !== null){
      json_space.innerHTML = JSON.stringify(data);
      document.querySelector('#json_space').style.display="block";
    }       
  }

  const getReview = async ()=>{
    var table = document.getElementById('table').getElementsByTagName('tbody')[0];
    if (table !== null){
      table.innerHTML='';
    }
    
    var highest_first = document.querySelector("#highest_first").value;
    var min_rating = document.querySelector("#min_rating").value;
    var order_date =document.querySelector("#order_date").value;
    var prioritize_by_text = document.querySelector("#prioritize_by_text").value;
    if(highest_first==='' || min_rating==='' || order_date==='' || prioritize_by_text===''){
      alert ('Please populate all inputs');
      return;
    }
    try {
      let res = await fetch(`http://localhost:4000/review?highest_first=${highest_first}&min_rating=${min_rating}&order_date=${order_date}&prioritize_by_text=${prioritize_by_text}`,{
        method:"GET",
        headers:{
          "Content-type":"application/json",
          "Access-Control-Allow-Origin":"*",
          "Access-Control-Allow-Headers": "Origin, X-Requested-With, Content-Type, Accept"
        }        
      })
       data = await res.json();            
      populateTable(data);
      document.querySelector('#json_space').style.display="none";
      document.querySelector('#table').style.display="table";
           
    } catch (error) {
      console.log(error.message);
    }
    
  }
 
  return(
    <div id='container'>
      <h2>Filter reviews</h2>
      <h4>Order by rating:</h4>
      <select id='highest_first' className="input">
        <option></option>
        <option value='highest-first'>highest-first</option>
        <option value='lowest-first'>lowest-first</option>
      </select>
      <h4>Minimum rating:</h4>
      <select id='min_rating' className="input">
      <option ></option>
        <option value='1'>1</option>
        <option value='2'>2</option>
        <option value='3'>3</option>
        <option value='4'>4</option>
        <option value='5'>5</option>
      </select>
      <h4>Order by date:</h4>
      <select id='order_date' className="input">
      <option></option>
        <option value='newest-first'>newest-first</option>
        <option value='oldest-first'> oldest-First </option>
      </select>
      <h4>Prioritize by text:</h4>
      <select  id='prioritize_by_text' className="input">
      <option></option>
        <option value="yes">yes</option>
        <option value='no'>no</option>
      </select>
      <br/>
      <br/>
      <div className="button-div">
      <button className="button" onClick={ () => { getReview()} }>Filter</button>
      <button className="show-json" onClick={()=>{showJson()}}>Show JSON File</button>
      </div>
      
      <table id='table' className="table">
      <thead>
        <tr>
          <th>Text</th>
          <th>Rating</th>
          <th>Date</th>          
        </tr>
      </thead>
      <tbody>                   
      </tbody>
    </table>
    <div id="json_space">

    </div>
    </div>    
    
  )
}  

