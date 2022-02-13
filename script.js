let dragStartItem;
function addEventListener() {
  const draggables = document.querySelectorAll('.draggable');
  const dragListItems = document.querySelectorAll('.draggable .items');
  draggables.forEach((draggable) => {
    draggable.addEventListener('dragstart', dragStart);
  });
  dragListItems.forEach((item) => {
    item.addEventListener('dragover', dragOver);
    item.addEventListener('drop', dragDrop);
    item.addEventListener('dragenter', dragEnter);
    item.addEventListener('dragleave', dragLeave);
  });
}

addEventListener();

function dragStart(e) {
  // console.log('dragStart');
  dragStartItem = e.target.children[0];
  console.log('dragStartIndex', dragStartItem);
}
function dragOver(e) {
  e.preventDefault();
}
function dragDrop(e) {
  e.target.classList.remove('over');
  swap(dragStartItem, e.target);
}
function dragEnter(e) {
  e.target.classList.add('over');
}
function dragLeave(e) {
  e.target.classList.remove('over');
}

function swap(from, to) {
  const fromContainer = from.parentElement;
  const toContainer = to.parentElement;
  fromContainer.removeChild(from);
  toContainer.removeChild(to);
  fromContainer.appendChild(to);
  toContainer.appendChild(from);
  dragStartItem = null;
}

/* const draggables = document.querySelectorAll('div.draggable');
const droppables = document.getElementsByClassName('droppable');
const contents = document.getElementsByClassName('content')[0].children;
const clone = Array.from(contents);
// Arrastaveis
for (let i = 0; i < draggables.length; i++) {
  draggables[i].addEventListener(
    'dragstart',
     (e) => {
      e.dataTransfer.effectAllowed = 'move';
      e.target.classList.add('destaque');
      Array.from(draggables).forEach((droppable) => {
        droppable.classList.add('droppableDestaque');
      });
    },
  );
  draggables[i].addEventListener('drag', drag);
  draggables[i].addEventListener(
    'dragend',
     (e) => {
      e.target.classList.remove('destaque');
      Array.from(draggables).forEach((droppable) => {
        droppable.classList.remove('droppableDestaque');
      });
    },
  );
}

function dragStart(e) {
  // console.log('COMEÇA A MEXER');
  e;
}

function drag(e) {
  // console.log('MEXENDO');
}

function dragEnd(e) {
  // console.log('TERMINEI DE MEXER');
}
// Largaveis
for (let i = 0; i < draggables.length; i++) {
  draggables[i].addEventListener('dragenter', dragEnter,false);
  draggables[i].addEventListener('dragover', dragOver, false);
  draggables[i].addEventListener('dragleave', dragLeave);
  draggables[i].addEventListener('drop', drop);
}
function dragEnter(e) {}

function dragOver(e) {
  const alvo = e.target;
  const mexido = document.getElementsByClassName('destaque');
  const pai = alvo.parentNode;
  const temp = alvo.innerHTML;
  console.log(alvo);
  // alvo.innerHTML = mexido.innerHTML;
  // mexido.innerHTML = temp;
}

function dragLeave(e) {}
function drop(e) {
  console.log('AQUIIIIIIIIIIIIII');
}
 */
