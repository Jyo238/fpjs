import * as R from 'ramda';

export const MSGS = {
  LEFT_VALUE_INPUT: 'LEFT_VALUE_INPUT',
  RIGHT_VALUE_INPUT: 'RIGHT_VALUE_INPUT',
  LEFT_UNIT_CHANGED: 'LEFT_UNIT_UNPUT',
  RIGHT_UNIT_CHANGED: 'RIGHT_UNIT_CHANGED',

}

export function leftValueInputMsg(leftValue) {
  return {
    type: MSGS.LEFT_VALUE_INPUT,
    leftValue
  }
}

export function rightValueInputMsg(rightValue) {
  return {
    type: MSGS.RIGHT_VALUE_INPUT,
    rightValue
  }
}

export function leftUnitInputMsg(leftUnitValue) {
  return {
    type: MSGS.LEFT_UNIT_CHANGED,
    leftUnitValue
  }
}

export function rightUnitInputMsg(rightUnitValue) {
  return {
    type: MSGS.RIGHT_UNIT_CHANGED,
    rightUnitValue
  }
}


const toInt = R.pipe(parseInt, R.defaultTo(0));

function update(msg, model) {
  switch (msg.type) {
    case MSGS.LEFT_VALUE_INPUT: {
      if (!msg.leftValue) {
        return { ...model, rightValue: '', leftValue: '', sourceLeft: true }
      }
      const leftValue = toInt(msg.leftValue);
      return convert({ ...model, leftValue, sourceLeft: true })
    }
    case MSGS.RIGHT_VALUE_INPUT: {

      if (!msg.rightValue) {
        return { ...model, rightValue: '', leftValue: '', sourceLeft: false }
      }
      const rightValue = toInt(msg.rightValue)
      return convert({ ...model, rightValue, sourceLeft: false })
    }
    case MSGS.LEFT_UNIT_CHANGED: {
      return convert({ ...model, leftUnit: msg.leftUnitValue })
    }
    case MSGS.RIGHT_UNIT_CHANGED: {
      return convert({ ...model, rightUnit: msg.rightUnitValue })
    }
  }

  return model;
}

function round(number) {
  return Math.round(number * 10) / 10;
}

function convert(model) {
  const { leftValue, leftUnit, rightValue, rightUnit } = model;
  const [fromUnit, fromTemp, toUnit] = model.sourceLeft ? [leftUnit, leftValue, rightUnit] : [rightUnit, rightValue, leftUnit];
  const otherValue = R.pipe(convertFromToTemp, round)(fromUnit, toUnit, fromTemp);

  return model.sourceLeft ? { ...model, rightValue: otherValue } : { ...model, leftValue: otherValue };
}

function convertFromToTemp(fromUnit, toUnit, temp) {
  const convertFn = R.pathOr(R.identity, [fromUnit, toUnit], UnitConversions);

  return convertFn(temp)
}

function FtoC(temp) {
  return 5 / 9 * (temp - 32);
}

function CtoF(temp) {
  return 9 / 5 * temp + 32;
}


function KtoC(temp) {
  return temp - 273.15
}


function CtoK(temp) {
  return temp + 273.15
}

const FtoK = R.pipe(FtoC, CtoK);
const KtoF = R.pipe(KtoC, CtoF);
const UnitConversions = {
  Celsuis: {
    Fahrenheit: CtoF,
    Kelvin: CtoK
  },
  Fahrenheit: {
    Celsuis: FtoC,
    Kelvin: FtoK
  },
  Kelvin: {
    Celsuis: KtoC,
    Fahrenheit: KtoF
  }
}
export default update;
