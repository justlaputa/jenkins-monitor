function save_options() {
    var info = document.querySelector('#info'),
    input = document.querySelector('#jenkins-url');

    info.innerHTML = "save url: " + input.value;

}


function restore_options() {

    
}


document.addEventListener('DOMContentLoaded', restore_options);
document.querySelector('#jenkins-url').addEventListener('input', save_options);