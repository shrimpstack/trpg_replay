window.addEventListener('load', () => {
  document.addEventListener('keydown', e => {
    if(/^(ArrowLeft)$/.test(e.code)) {
      prev();
    }
    if(/^(Enter|Space|ArrowRight)$/.test(e.code)) {
      next();
    }
  });
  page_c.addEventListener('change', () => {
    page_c.value = f_minmax(page_c.value, 1, book.length);
    current.c = page_c.value - 1;
    current.i = 0;
    play();
  });
  page_i.addEventListener('change', () => {
    page_i.value = f_minmax(page_i.value, 1, book[current.c].length);
    current.i = page_i.value - 1;
    play();
  });
  Cookie.read();
  start();
});
function f_minmax(v, min, max) {
  return Math.min(Math.max(Math.floor(v), min), max);
}

const current = {
  c: 0,
  i: 0,
};
var book = [];
function start() {
  book = [c1, c2];
  let read = Cookie.get('current_page');
  if(read) {
    read = read.split("s").map(v => +v);
    current.c = f_minmax(read[0], 0, book.length - 1);
    current.i = f_minmax(read[1], 0, book[current.c].length - 1);
  }
  else {
    current.c = 0;
    current.i = 0;
  }
  play();
}
function prev() {
  prev_tick();
  play();
}
function next() {
  tick();
  play();
}
function play() {
  if(!book[current.c]) return end();
  if(!book[current.c][current.i]) return;
  let data = book[current.c][current.i];
  set_text(data.text);
  set_name(data.name, data.color);
  set_c_img(data.c_img, data.name);
  set_show_img(data.show_img);
  set_bg(data.bg);
  Cookie.set('current_page', current.c + "s" + current.i);
  page_c.value = current.c + 1;
  page_i.value = current.i + 1;
}
function prev_tick() {
  current.i--;
  if(current.i < 0) {
    if(current.c > 0) {
      current.c--;
      current.i = book[current.c].length - 1;
    }
    else {
      current.i = 0;
    }
  }
}
function tick() {
  current.i++;
  if(current.i >= book[current.c].length) {
    if(book[current.c + 1]) {
      current.c++;
      current.i = 0;
    }
    else current.i--;
  }
}
function end() {
  console.log('end');
  current.c = 0;
  current.i = -1;
}

function set_text(text_arr) {
  content.innerText = text_arr.join('\n');
}
function set_name(target_name, target_color) {
  c_name.innerText = target_name || "--------";
  if(!target_color) {
    c_name.removeAttribute('name');
  }
  else {
    c_name.setAttribute('name', target_color);
  }
}
function set_c_img(target_c_img, c_name) {
  let img_name = typeof target_c_img != "undefined" ? target_c_img : c_name;
  if(!img_name) {
    char_img.src = "";
    char_img.removeAttribute('src');
  }
  else {
    char_img.src = `./imgs/character/${img_name}.png`;
  }
}
function set_bg(bg_name) {
  let img_path = bg_name;
  switch(bg_name) {
    case "c4_aaa": img_path += ".gif"; break;
    default: img_path += ".png"; break;
  }
  bg.style.backgroundImage = `url(./imgs/bg/${img_path})`;
}
function set_show_img(target_show_img) {
  if(!target_show_img) {
    show_img.src = "";
    show_img.removeAttribute('src');
    return;
  }
  switch(target_show_img) {
    case "c4_aaa": target_show_img += ".gif"; break;
    default: target_show_img += ".png"; break;
  }
  show_img.src = `./imgs/show/${target_show_img}`;
}