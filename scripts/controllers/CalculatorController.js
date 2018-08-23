
class CalculatorController {
    
    constructor(){
        this._DisplayValue;
        this._currentDate;
        this.initialize();
    }

    
    initialize(){
        let displayValue = document.querySelector('#display');
        let displayHour = document.querySelector('#hora');
        let displayDate = document.querySelector('#data');

        displayValue.innerHTML = "50";
        displayDate.innerHTML = "22/08/2018";
        displayHour.innerHTML = "00h00";
    }

    get getDisplayCalc(){
        return this._DisplayValue;
    }

    set setDisplayCalc(value){
        this._DisplayValue = value;
    }

}

