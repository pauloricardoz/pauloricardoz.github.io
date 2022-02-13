let dragStartItem;
function addEventListener() {
  const draggables = document.querySelectorAll('.draggable');
  const dragListItems = document.querySelectorAll('.draggable');
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
  getParent(e.target).classList.remove('over');
  swap(dragStartItem, getParent(e.target));
}
function dragEnter(e) {
  if (getParent(e.target) && !getParent(e.target).classList.contains('items'))
    return;
  if (getParent(e.target) === dragStartItem) return;
  getParent(e.target) && getParent(e.target).classList.add('over');
}
function dragLeave(e) {
  getParent(e.target) && getParent(e.target).classList.remove('over');
}
function getParent(element) {
  if (element.tagName === 'BODY') return;
  if (element.classList.contains('items')) return element;
  return getParent(element.parentElement);
}
function swap(from, to) {
  if (from === to) return;
  if (!to.classList.contains('items')) return;
  const fromContainer = from.parentElement;
  const toContainer = to.parentElement;
  fromContainer.removeChild(from);
  toContainer.removeChild(to);
  fromContainer.appendChild(to);
  toContainer.appendChild(from);
  dragStartItem = null;
}

function myAge() {
  document.getElementById('age').innerText =
    new Date(new Date() - new Date('1988/03/05')).getUTCFullYear() - 1970;
}
myAge();
