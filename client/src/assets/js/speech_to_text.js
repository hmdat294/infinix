var speech = false;
var speech_input = null;
window.SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;

const recognition = new SpeechRecognition();
recognition.interimResults = true;
recognition.lang = 'vi-VN';

let final_transcript = '';  // Lưu trữ kết quả cuối cùng

recognition.addEventListener('result', e => {
    let interim_transcript = '';

    Array.from(e.results).forEach(result => {
        if (result.isFinal) {
            final_transcript += result[0].transcript;  // Kết quả đã hoàn thành được thêm vào final_transcript
        } else {
            interim_transcript += result[0].transcript;  // Kết quả tạm thời
        }
    });

    if (!speech_input) {
        return;
    }

    // Hiển thị kết quả tạm thời và hoàn thành
    speech_input.value = final_transcript + " " +  interim_transcript;
});

recognition.addEventListener('end', () => {
    if (speech == true) {
        recognition.start();
    } else {
        final_transcript = '';
    }
});

document.querySelectorAll(".speech-to-text").forEach(item => {
    var target = item.getAttribute('data-target');
    var input = document.getElementById(target);
    item.addEventListener('click', () => {
        if (!input) {
            return;
        }
        speech = !speech;
        if (speech) {
            speech_input = input;
            recognition.start();
        } else {
            recognition.stop();
        }
    });
});
