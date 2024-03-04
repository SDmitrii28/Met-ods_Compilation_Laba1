//Нисходящая стратегия
const downwardParser = (e) => {
    const T = ["!", "+", "*", "(", ")", "a", "b"]; //порождающая грамматика. терминалы
    const N = ["A", "B", "T", "M"]; //A - стартовый символю. нетерминалы
    //продукции
    const Productions = {
        "A": ["!B!"],
        "B": ["T", "T+B"],
        "T": ["M", "M*T"],
        "M": ["a", "b", "(B)"]
    };
//     const Productions = {
//     "B": ["T+B", "T"],
//     "T": ["M", "M*T"],
//     "M": ["a", "b"]
// };
    const start = Object.keys(Productions)[0];//берем все левые части из объекта, нулевой т е буква А
    console.log(start);
    e.preventDefault();// нужно для отображения в html
    const form = document.getElementById('downwardParser');
    const formData = new FormData(form);
    const omega = formData.get('input');//строка из input

    const L1 = [];// массив содержащий историю проделанных подстановок, индексы альтернатив и прочитанные символы
    const L2 = [];//цепочка вывода
    const answer = [];
    let omegaIndex = 0;
    L2.unshift(start);// вставка в начало масива L2
    T.indexOf(start) < 0 ? step1() : step2();//проверка если start не териминал то переходим к шагу 1 иначе к шагу 2

    function step1 () { // для НЕтерминала
        const notTerm = L2.shift();//извлекаем первый элемент
        L1.push({[notTerm]: 0});//ключ - (элемент стека L2 символ, 0 - индекс
        (Productions[notTerm][0].split('').reverse()).forEach(el => {
            L2.unshift(el);//вставляем в начало
        });
        console.log(L1);
        console.log(L2);
        console.log(omegaIndex);
        T.indexOf(L2[0]) < 0 ? step1() : step2();//проверка если L2[0] не териминал то переходим к шагу 1 иначе к шагу 2
    }
    
    function step2 () { // для терминала
        if (omega[omegaIndex] == L2[0]) {
            L1.push(L2.shift());
            omegaIndex++;
            if (omegaIndex > omega.length-1 && L2.length == 0) {
                step3();
            }
            else if (omegaIndex > omega.length ^ L2.length == 0) {
                        step3Alt(L1[L1.length -1]);
            }
            else {
                T.indexOf(L2[0]) < 0 ? step1() : step2();//проверка если L2[0] не териминал то переходим к шагу 1 иначе к шагу 2
            };
        }
        else step4(L1[L1.length -1]);
        console.log(L1);
        console.log(L2);
        console.log(omegaIndex);
    }

    function step3() { // анализ стека L1 и вывод результата
        const nonTermsProductsNumbers = [];
        for (const key in Productions) {
            nonTermsProductsNumbers.push(Productions[key].length);
        };
        L1.forEach(el => {
            if (typeof(el)=="object") {
                let a=0;
                const b = Object.keys(Productions).indexOf(Object.keys(el)[0]);
                for(let i=0;i<b;i++) {
                    a+=nonTermsProductsNumbers[i];
                }
                a+=(Object.values(el)[0]+1);
                answer.push(a);
            }
        })
        form.output.value=answer;
    }
    
    function step3Alt (el) {
        toReturn(el);
        console.log(L1);
        console.log(L2);
        console.log(omegaIndex);
    }

    function step4 (el) {
        toReturn(el);
        console.log(L1);
        console.log(L2);
        console.log(omegaIndex);
    }
    
    function step5 () { // возврат по терминалу
        L2.unshift(L1.pop());//перемещаем из L1 В L2
        omegaIndex--;
        toReturn(L1[L1.length -1]);
        console.log(L1);
        console.log(L2);
        console.log(omegaIndex);
    }
//меняем на следующую альетнативу
    function step6A (el) {
        console.log(L1);
        el[`${Object.keys(el)[0]}`]+=1;//доступ к значению, увеличиваем индекс
        // заменаем с 0 до длинны имеющего ранее альтернативы
        L2.splice(0,Productions[Object.keys(el)[0]][Object.values(el)[0]-1].split('').length, 
                 ...Productions[Object.keys(el)[0]][Object.values(el)[0]]);
        T.indexOf(L2[0]) < 0 ? step1() : step2();//проверка если L2[0] не териминал то переходим к шагу 1 иначе к шагу 2
        console.log(L1);
        console.log(L2);
        console.log(omegaIndex);
    }

    function step6B () {
        console.error("Ошибка");//вывод ошибки
        form.output.value='Ошибка';
    }

    function step6C (el) {
        L1.pop(); //удаляем из стека L1 последний элемент
        //заменаем альтернативу по номеру по послденему элементу стека L1, до длинны индекса используемой альтернативы, на левую часть данной альтернативы
        L2.splice(0, Productions[Object.keys(el)[0]][Object.values(el)[0]].split('').length, Object.keys(el)[0]);
        toReturn(L1[L1.length -1]);//остаемся  в  состояние возврата
        console.log(L1);
        console.log(L2);
        console.log(omegaIndex);
    }

    function toReturn(el) {
        if (el) {// существует ли элемент или нет
            if (typeof(el) == "object") {// проверяем является ли нетерминалом
                if (Object.values(el)[0] < Productions[Object.keys(el)[0]].length-1) step6A(el);// проверка на наличие других альтернатив
                else step6C(el);//если альтернатив нет
            }
            else step5();//если является терминалом 
        }
        else step6B();
    }
}

const form = document.getElementById('downwardParser');
form.addEventListener('submit', downwardParser)
