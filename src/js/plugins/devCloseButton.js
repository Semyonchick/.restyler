const devDisable = document.createElement('div');
devDisable.innerHTML = '&times;';
devDisable.style = 'width:20px;' +
  'height: 39px;' +
  'background: rgba(255,235,50,0.5);' +
  'position:absolute;' +
  'z-index: 55555;' +
  'top:0;' +
  'text-align:center;' +
  'line-height:39px;' +
  'font-size:20px;' +
  'color:red;' +
  'right:0;' +
  'cursor:pointer;';
devDisable.addEventListener('click', _ => location.href = '?dev=0');
document.getElementsByTagName('body')[0].appendChild(devDisable);