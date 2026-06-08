class Conta {
  constructor(id, conta, date, valor, checked = false) {
    this.id = id;
    this.conta = conta;
    this.date = date;
    this.valor = valor;
    this.checked = checked || false;
  }
  toString() {
    return JSON.stringify({
      id: this.id,
      conta: this.conta,
      date: this.date,
      checked: this.checked,
    });
  }
}
class Contas {
  contas = [];
  constructor() {}
  _getId = undefined;
  *_gerador() {
    const ids = this.contas.map((item) => item.id);
    let i = Math.max(...ids, 0) + 1;
    while (true) {
      yield i++;
    }
  }
  getId() {
    if (!this._getId) {
      this._getId = this._gerador();
    }
    return this._getId.next().value;
  }
  incluir(nomeConta, date, valor, checked) {
    if (nomeConta === '' || date === '') {
      throw new Error('Preencha todos os campos');
    }
    const conta = new Conta(
      this.getId(),
      nomeConta,
      date,
      valor ? Number(valor) : 0,
      checked,
    );
    this.contas.push(conta);
    return conta;
  }
  listar() {
    return this.contas;
  }
  excluir(id) {
    this.contas = this.contas.filter((conta) => conta.id !== id);
  }
  atualizar(id, contaAtualizada) {
    const index = this.contas.findIndex((conta) => conta.id === id);
    if (index !== -1) {
      this.contas[index] = { ...this.contas[index], ...contaAtualizada };
    }
  }
  indicarPagamento(id) {
    const index = this.contas.findIndex((conta) => conta.id === id);
    if (index !== -1) {
      return false;
    }
    this.contas[index].checked = true;
    return true;
  }
  sortByDate() {
    this.contas.sort((a, b) => new Date(a.date) - new Date(b.date));
  }
  carregarLista(listaContas) {
    this.contas = [];
    listaContas.forEach((item) => {
      this.incluir(item.conta, item.date, item.valor || 0, item.checked);
    });
    this.sortByDate();
  }
  toString() {
    return JSON.stringify(this.contas);
  }
}

class FrontEnd {
  localstoreKey = 'lista-contas';
  listaData = [];
  lista = document.getElementById('lista');
  form = document.getElementById('form');
  contaInput = document.getElementById('contaInput');
  dateInput = document.getElementById('dateInput');
  valorInput = document.getElementById('valorInput');
  btnSubmit = document.getElementById('btn-submit');
  btnReset = document.getElementById('btn-reset');
  editLink = document.getElementById('entrar-edit');
  sairLink = document.getElementById('sair-edit');
  isEditMode = false;

  constructor() {
    this.contas = new Contas();
  }
  init() {
    this.form.addEventListener('submit', (event) => this.submit(event));
    this.btnSubmit.addEventListener('click', (event) => this.click(event));
    this.btnReset.addEventListener('click', () => this.clearForm());
    this.loadLocalstore();
  }
  loadLocalstore() {
    const data = localStorage.getItem(this.localstoreKey);
    if (data) {
      const parsedData = JSON.parse(data);
      this.contas.carregarLista(parsedData);
      this.contas.listar().forEach((conta) => this.addItemLista(conta));
    }
  }
  saveLocalstore() {
    localStorage.setItem(this.localstoreKey, this.contas.toString());
  }
  deleteLocalstore() {
    localStorage.removeItem(this.localstoreKey);
  }
  // Actions da lista de itens
  addItemLista(conta) {
    const checkbox = document.createElement('input');
    checkbox.type = 'checkbox';
    checkbox.checked = conta.checked;
    checkbox.addEventListener('change', (event) =>
      this.changeItemLista(event, conta),
    );

    const span = document.createElement('span');
    span.textContent = `${conta.date.toString().padStart(2, '0')} - ${conta.conta.toUpperCase()}${conta.valor ? `. Valor: R$ ${conta.valor.toFixed(2)};` : ''}`;

    const item = document.createElement('li');
    item.style.listStyleType = 'none';
    item.appendChild(checkbox);
    item.appendChild(span);
    this.lista.appendChild(item);
    // sortByDate();
    this.saveLocalstore();
  }
  deleteItemLista(item, element) {
    item.remove();
    this.contas.excluir(element.id);
    this.listaData.splice(this.listaData.indexOf(element), 1);
    this.saveLocalstore();
  }
  changeItemLista(event, item) {
    const checked = event.target.checked;
    item.checked = checked;
    this.saveLocalstore();
  }
  // Form actions
  submit(event) {
    event.preventDefault();
  }
  click(event) {
    event.preventDefault();
    const nomeConta = contaInput.value.trim();
    const date = dateInput.value.trim();
    const valor = document.getElementById('valorInput').value.trim();
    if (nomeConta === '' || date === '') {
      alert('Preencha todos os campos');
      return;
    }
    const conta = this.contas.incluir(nomeConta, date, valor);
    this.contas.sortByDate();
    this.addItemLista(conta);

    this.clearForm();
    this.contaInput.focus();
  }
  clearForm() {
    this.form.reset();
  }
  // Edit mode
  changeElementsLinkEdition() {
    if (this.isEditMode) {
      this.editLink.style.display = 'none';
      this.sairLink.style.display = 'inline';
    } else {
      this.editLink.style.display = 'inline';
      this.sairLink.style.display = 'none';
    }
  }
  changingMode() {
    this.lista.innerHTML = '';
    this.contas.listar().forEach((conta) => {
      const date = document.createElement('input');
      date.type = 'number';
      date.value = conta.date;

      const nomeConta = document.createElement('input');
      nomeConta.type = 'text';
      nomeConta.value = conta.conta;

      const valor = document.createElement('input');
      valor.type = 'number';
      valor.value = conta.valor;

      const btnDelete = document.createElement('button');
      btnDelete.textContent = 'X';
      btnDelete.addEventListener('click', () =>
        this.deleteItemLista(item, conta),
      );

      const item = document.createElement('li');
      item.style.listStyleType = 'none';
      item.idConta = conta.id;
      item.appendChild(date);
      item.appendChild(nomeConta);
      item.appendChild(valor);
      item.appendChild(btnDelete);

      this.lista.appendChild(item);
    });
  }
  viewingMode() {
    [...this.lista.children].forEach((item) => {
      const id = item.idConta;
      const date = item.children[0];
      const nomeConta = item.children[1];
      const valor = item.children[2];
      this.contas.atualizar(id, {
        date: date.value,
        conta: nomeConta.value,
        valor: Number(valor.value),
      });
    });
    this.lista.innerHTML = '';
    this.contas.listar().forEach((conta) => this.addItemLista(conta));
  }

  checkEditMode() {
    this.changeElementsLinkEdition();
    if (this.isEditMode) {
      // this.form
      this.changingMode();
    } else {
      this.viewingMode();
    }
  }
  changeEditMode() {
    this.isEditMode = !this.isEditMode;
    this.checkEditMode();
  }
}

const front = new FrontEnd();
front.init();

// navbar toggle
const navToggle = document.getElementById('nav-toggle');
navToggle.addEventListener('click', () => {
  navToggle.classList.toggle('is-active');
  const nav = document.querySelector('ul.nav');
  nav.classList.toggle('show');
});
