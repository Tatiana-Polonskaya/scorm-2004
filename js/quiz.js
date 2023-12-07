"use strict";

const steps = [
  {
    title: "Приветствие",
    description: "Автор: Татьяна Полонская, группа: J4207.",
    score: 1,
    isScored: true,
  },
  {
    title: "Клиент-Сервер",
    description:
      "Архитектура «Клиент-Сервер» предусматривает разделение процессов предоставления услуг и отправки запросов на них на разных компьютерах в сети, каждый из которых выполняет свои задачи независимо от других.",
    score: 2,
    isScored: false,
  },
  {
    title: "Тонкий клиент",
    description:
      "Тонкий клиент в компьютерных технологиях — компьютер или программа-клиент в сетях с клиент-серверной, или терминальной архитектурой, который переносит все или большую часть задач по обработке информации на сервер.",
    score: 4,
    isScored: false,
  },
  {
    title: "Толстый клиент",
    description:
      "В архитектуре клиент — сервер это приложение, обеспечивающее (в противовес тонкому клиенту) расширенную функциональность независимо от центрального сервера. ",
    score: 8,
    isScored: false,
  },
  {
    title: "Тестирование",
    description: "Выберите один правильный ответ.",
    score: 16,
    question: {
      title: "Клиент-сервер это ...?",
      answers: ["Архитектура", "Маршрут", "База данных"],
      correct: "Архитектура",
      score: 100 - 31,
    },
    isScored: false,
  },
];

let result = 1;
let minimum = 32;
let maximum = 100;
let currentSlider = 0;

// ------------------------------------------------- SLIDERS -------------------------------------------------
let questionSlider = document.getElementById("carousel-inner");

// ------------------------------------------------- SCORES -------------------------------------------------
const userScore = document.getElementById("user-score");
userScore.innerText = String(result);
const maxScore = document.getElementById("max-score");
maxScore.innerText = String(maximum);

// ------------------------------------------------- RESULT -------------------------------------------------
const quizResult = document.getElementById("quiz-result");
const allDoneAlert = document.getElementById("all-done");

const passingScore = document.getElementById("passing-score");
passingScore.innerText = String(minimum);

const setUserScore = () => {
  userScore.innerText = String(result);

  scorm.set("cmi.score.scaled", (result / maximum) * 100);
  scorm.set("cmi.score.raw", result);
  scorm.save();
};

const setComplete = () => {
  let completion = scorm.set("cmi.completion_status", "completed");
  let success;

  result >= minimum
    ? (success = scorm.set("cmi.success_status", "passed"))
    : (success = scorm.set("cmi.success_status", "failed"));

  console.log(completion);
  completion
    ? scorm.quit()
    : console.log("Ошибка: Курс не может быть отмечен как пройденный!");
};

// ------------------------------------------------- CONTENT GENERATION -------------------------------------------------
for (let i = 0; i < steps.length; i++) {
  questionSlider.insertAdjacentHTML(
    "beforeend",
    i == steps.length - 1
      ? `<div class="carousel-item "> 
                        <div class="p-5">
                            <form class='row mx-5' name="question-${i}">
                                <div>
                                    <p class='small'>${steps[i].title}</p>
                                </div>
                                <div>
                                    <p class="lead"> ${
                                      steps[i].question.title
                                    }</p>
                                    <p class="small"> ${
                                      steps[i].description
                                    }</p>
                                </div>
                                <div class="answers">
                                    ${steps[i].question.answers
                                      .map(
                                        (el, j) =>
                                          `<div class='form-check'> 

                                                <input class="form-check-input" 
                                                type="radio" 
                                                value="${el}"
                                                name="question-${i}"
                                                id="flexRadioDefault-${j}" />

                                                <label class="form-check-label" for="flexRadioDefault-${j}">
                                                    ${el} 
                                                </label>

                                            </div>`
                                      )
                                      .join("")}
                                </div>
                                <div class="col-auto">
                                   <p id="btn-submit-question-${i}" class="btn submit btn-primary my-3" onclick="handleSubmitButton(${i})">Завершить</p>
                                </div>
                           </form> 
                           <div class="alert " id="result-answer-${i}"></div>
                        </div> 
        </div>`
      : `<div class="carousel-item ${i === 0 ? "active" : ""}"> 
            <div class="p-5">
                <h2>
                    ${steps[i].title}
                </h2>
                <div>
                    ${steps[i].description}
                </div>
            </div> 
        </div>`
  );
}

// ------------------------------------------------- NEXT BUTTON -------------------------------------------------
function nextButtomClick() {
  if (currentSlider + 1 < steps.length) {
    console.log("currentSlider", currentSlider);
    console.log("isScored", steps[currentSlider].isScored);
    if (!steps[currentSlider].isScored) {
      currentSlider += 1;
      result += steps[currentSlider].score;
      steps[currentSlider].isScored = true;

      setUserScore();
    }
  }
}

// ------------------------------------------------- SUBMIT BUTTON -------------------------------------------------
function handleSubmitButton(index) {
  const userAnswer = document.querySelector(
    `input[name="question-${CSS.escape(String(index))}"]:checked`
  ).value;

  const resultElement = document.querySelector(`#result-answer-${index}`);
  let resultClass = "";
  let resultMessage = "";

  if (userAnswer === steps[index].question.correct) {
    result += steps[index].question.score;
    resultClass = "alert-success";
    resultMessage = "Правильно!";
  } else {
    resultClass = "alert-danger";
    resultMessage = "Ответ неверный.";
  }
  setUserScore();

  resultElement.classList.add(resultClass);
  resultElement.innerHTML = resultMessage;
  resultElement.setAttribute("disabled", "false");

  const inputs = document.querySelectorAll(
    `input[name="question-${CSS.escape(String(index))}"]`
  );

  inputs.forEach((input) => {
    input.setAttribute("disabled", "true");
  });

  quizResult.innerText = result;
  allDoneAlert.classList.remove("visually-hidden");
  allDoneAlert.classList.add(
    result >= minimum ? "alert-success" : "alert-danger"
  );

  setComplete();
}
