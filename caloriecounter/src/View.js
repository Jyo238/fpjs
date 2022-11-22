import hh from 'hyperscript-helpers';
import { h } from 'virtual-dom';
import { showFormMsg, mealInputMsg, caloriesInputMsg, saveMealMsg,deleteMealMsg, editMealMsg } from './Update';
import * as R from 'ramda';
const {   div, h1, button, label, input, form,thead,tr,td,th,table,tbody,i  } = hh(h);

function fieldSet(labelText, inputValue, oninput) {
    return div([
        label({ className: 'db mb1' }, labelText),
        input({
            className: 'pa2 input-reset ba w-100 mb2',
            type: 'text',
            value: inputValue,
            oninput
        })])
}

function buttonSet(dispatch) {
    return div([
        button({ className: 'f3 pv2 ph3 bg-blue white bn mr2 dim', type: 'submit' }, 'Save'),
        button({
            className: 'f3 pv2 ph3 bg-light-gray dim', type: 'button',
            onclick: () => dispatch(showFormMsg(false))
        }, 'Cancel')

    ])
}

function formView(dispatch, model) {
    const { description, calories, showForm } = model;
    if (showForm) {
        return form({
            className: 'w-100 mv2',
            onsubmit: e => {
                e.preventDefault();
                dispatch(saveMealMsg)
            }
        }, [
            fieldSet('Meal', description, e => dispatch(mealInputMsg(e.target.value))),
            fieldSet('Calories', calories || '', e => dispatch(caloriesInputMsg(e.target.value))),
            buttonSet(dispatch)
        ])
    }
    return button({
        className: 'f3 pv2 ph3 bg-blue white bn',
        onclick: () => dispatch(showFormMsg(true))
    }, 'Add Meal')

}

function view(dispatch, model) {
    return div({ className: 'mw6 center' },
        [
            h1({ className: 'f2 pv2 bb' }, 'Calories Counter'),
            formView(dispatch, model),
            tableView(dispatch,model.meals),
        ])
}



function cell(tag, className, value) {
    return tag({ className }, value);
}

const tableHeader = thead([
    tr([
        cell(th, 'pa2 tl', 'Meal'),
        cell(th, 'pa2 tr', 'Calories'),
        cell(th, '', ''),
    ])
])

function mealRow(dispatch, className, meal) {
    console.log(meal)
    return tr({ className }, [
        cell(td, 'pa2', meal.description),
        cell(td, 'pa2 tr', meal.calories),
        cell(td, 'pa2 tr', 
        [
        i({ className: 'ph1 fa fa-trash-o pointer',onclick:()=>dispatch(deleteMealMsg(meal.id)) }, ''),
        i({ className: 'ph1 fa fa-pencil-square-o pointer',onclick:()=>dispatch(editMealMsg(meal.id)) }, '')
    ])
    ])
}

function totalRow(meals) {
    const total = R.pipe(R.map(meal => meal.calories), R.sum)(meals);
    return tr({ className: 'bt b' }, [
        cell(td, 'pa2 tr', 'Total:'),
        cell(td, 'pa2 tr', total),
        cell(td, '', '')
    ])
}

function mealsBody(dispatch, className, meals) {
    const rows = R.map(
        R.partial(mealRow, [dispatch, 'stripe-dark']),
        meals);
    const rowsWithTotal = [...rows, totalRow(meals)];
    return tbody({ className }, rowsWithTotal);
}

function tableView(dispatch, meals) {
    if (meals.length === 0) {
        return div({ className: 'mv2 i black-50' }, 'No meals....');
    }
    return table({ className: 'mv2 w-100 collaspse' }, [
        tableHeader,
        mealsBody(dispatch, '', meals)
    ])
}

export default view;