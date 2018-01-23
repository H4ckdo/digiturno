import $ from 'jquery';
import React from 'react';
import ReactDOM from 'react-dom';
import Pack from '../components/Pack.jsx';

$(document).ready(() => {
  ReactDOM.render(
    <Pack/>,
    document.getElementById("app")
  )
})
