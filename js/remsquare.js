/**
 * Матрица посещений
 * Состояния ячеек сетки в виде двумерного массива
 */
var statesCells = [];

/**
 * Пары узлов
 */
var pair = [];

/**
 * Получить количество строк
 */
function getRow() {
    return jQuery('#row').val();
}

/**
 * Получить количество столбцов
 */
function getCol() {
    return jQuery('#col').val();
}

/**
 * Проверка значения на int
 * @param {int} val
 *   Значение для проверки
 */
function isInt(val) {
    var result = false;
    if (Math.floor(val).toString() === val && jQuery.isNumeric(val)) {
        result = true;
    }
    return result;
}

/**
 * Является ли число положительным
 * @param {int} val
 *   Значение для проверки
 */
function numPositive(val) {
    var result = false;
    if (val >= 0) {
        result = true;
    }
    return result;
}

/**
 * Конвертировать одномерный массив в двумерный
 * @param {array} vector
 *   Одномерный массив
 * @param {int} col
 *   Количество ячеек в строке
 */
function convMatrix(vector, col) {
    var matrix = [];
    while (vector.length) {
        matrix.push(vector.splice(0, col));
    }
    return matrix;
}

/**
 * Построение сетки
 * @param {int} row
 *   Число строк
 * @param {int} col
 *   Число столбцов
 */
function buildGrid(row, col) {
// Общее количество ячеек
    var totalСells = row * col;
    // Разметка ячеек
    var htmlCells = '';
    // Каскадные стили
    var styles = '.cell {width: calc(100% / ' + col + '); padding-bottom: calc(100% / ' + col + ');}';
    for (var i = 0; i < totalСells; i++) {
        htmlCells += '<div class="cell selected"></div>';
    }

    jQuery('head style').remove();
    jQuery('<style>' + styles + '</style>').appendTo('head');
    jQuery('#grid').html(htmlCells);
}

/**
 * Алгоритм поиска в ширину
 * Breadth-First Search (BFS)
 * @param {int} x
 *   Координата текущей строки
 * @param {int} y
 *   Координата текущего столбца
 * @param {int} length
 *   Всего строк в массиве
 * @param {int} height
 *   Всего столбцов в массиве
 */
function dfs(x, y, length, height) {

    if (x === length || x === -1 || y === height || y === -1) {
        return;
    } else if (statesCells[x][y] === -1) { // Если ячейка пустая
        return;
    }

    // Поиск одинаковых координат
    for (var i = 0; i < pair.length; i++) {
        if (pair[i][0] === x && pair[i][1] === y) {
            return;
        }
    }

    pair.push([x, y]); // Сохранить текущее местоположение

    dfs(x + 1, y, length, height); // Проверить ячейку слева
    dfs(x - 1, y, length, height); // Проверить ячейку справа
    dfs(x, y + 1, length, height); // Проверить ячейку сверху
    dfs(x, y - 1, length, height); // Проверить ячейку снизу

}

/**
 * Сохранить координаты в матрице истории посещений
 * @param {int} value
 *   Значение, которое надо сохранить
 */
function saveStateCell(value) {
    var n = pair.length;
    for (var i = 0; i < n; i++) {
        statesCells[pair[i][0]][pair[i][1]] = value;
    }
}

/**
 * Считывание состояния ячеек из сетки
 * @param {int} col
 *   Число колонок
 */
function readGrid(col) {
    col = parseInt(col);
    var states = [];  // Состояния ячеек сетки
    var pieces = 0;   // Количество найденных кусков
    var quantity = jQuery('#grid .cell').length;
    if (quantity > 0) {
        // Перебор ячеек сетки
        jQuery('#grid .cell').each(function () {
            if (jQuery(this).hasClass('selected')) {
                states.push(0); // Занятая ячейка
            } else {
                states.push(-1); // Пустая ячейка
            }
        });
    }

    // Одномерные массивы конвертировать в двумерные
    statesCells = convMatrix(states, col);

    // Количество строк в матрице
    var m = statesCells.length;

    // Проход по матрице
    for (var i = 0; i < m; i++) {
        var row = statesCells[i];  // Элементы строки
        var n = row.length; // Количество столбцов в матрице
        for (var j = 0; j < n; j++) {
            if (row[j] === 0) {  // Ячейка не пустая и не посещенная
                pieces += 1;     // Количество кусков
                pair = [];
                dfs(i, j, m, n); // Обработка данных поиском в ширину
                saveStateCell(pieces);  // Сохранить координаты
            }
        }
    }

    // Вывести ответ на экран
    jQuery('#answer').html('Количество кусков: <b>' + pieces + '</b>');
}


/**
 * Выполняем действия когда DOM полностью загружен
 */
jQuery(document).ready(function () {
    // Отслеживаем изменение числа строк и числа столбцов
    jQuery('#row, #col').on('keyup', function () {
        var row = getRow(); // Количество строк на сетке
        var col = getCol(); // Количество столбцов на сетке
        var message = ''; // Сообщение пользователю

        if (row === '' || col === '') { // Значения не пустые
            message = 'Введите число строк и столбцов в соответствующие текстовые поля.';
        } else if (!isInt(row) || !isInt(col)) { // Являются Int
            message = 'Входные параметры не являются целочисленными.';
        } else if (!numPositive(row) || !numPositive(col)) { // Положительные числа
            message = '<b>Ошибка! </b>Входные параметры должны иметь положительные значения!';
        } else if (row > 150 || col > 150) {
            message = '<b>Ошибка! </b>Введите значения текстовых полей <= 150.';
        }

        if (message === '') {
            buildGrid(row, col); // Построение сетки
            readGrid(col); // Считывание состояния ячеек из сетки
        } else {
            jQuery('#grid').html('<p>' + message + '</p>');
        }
    });
    // Отслеживаем клик по ячейке
    jQuery('#grid').on('click', '.cell', function () {
        var col = getCol(); // Количество столбцов на сетке
        jQuery(this).toggleClass('selected'); // Добавить/удалить класс
        readGrid(col); // Считывание состояния ячеек из сетки
    });
});
