
class CalculatorController {
    
    constructor(){
        this._local = ("pt-bt");
        this._lastOperator = "";
        this._lastNumber = "";
        this._DisplayResult = document.querySelector('#display');
        this._displayHour = document.querySelector('#hora');
        this._displayDate = document.querySelector('#data');
        this._ExpressionCalculate = [];             //expressao (vetor)
        this.initialize();
        this.initButtonsEvents();
    }
    
    initialize(){
        
        let time = 1000;
        setInterval(() =>{
            let currentDate = this.currentDate;
            this.setDisplayDate = currentDate.toLocaleDateString(this._local);
            this.setDisplayHour = currentDate.toLocaleTimeString(this._local);
        }, time);
  
    }

    // LISTEN AND TREAD MOUSE EVENTS (CLICK ON THE BUTTONS)
    initButtonsEvents (){
        // Take everything you found about to tag 'g' inside the id-'buttons' and id-'parts
        let buttonsList = document.querySelectorAll("#buttons > g, #parts > g");        
        
        // button = value of Tag 'g' html
        buttonsList.forEach((button, index) => {
            this.addEventListenerAll(button, "click drag", functionClick =>{
                let numberClickButton = button.className.baseVal.replace("btn-", "")
                this.displayExpression(numberClickButton);
            });

            this.addEventListenerAll(button, "mouseover mouseup mousedown", e =>{
                button.style.cursor = "pointer";
            });
        });
    }

    // FUNCTION TO CAPTURE VARIOUS EVENTS ON THE ITEM
    addEventListenerAll(element, events, functionClick){
        events.split(" ").forEach(event => {
            element.addEventListener(event, functionClick, false)
        })
    }

    displayExpression(buttonValue){

        switch (buttonValue) {
            case "ac":
                this.clearDisplayExpression();
                break;
            case "ce":
                this.ce();
                break;
            case "porcento":
                this.addOperation("%");
                break;
            case "divisao":
                this.addOperation("/");    
                break;
            case "multiplicacao":
                this.addOperation("*");
                break;
            case "subtracao":
                this.addOperation("-");
                break;
            case "soma":
                this.addOperation("+");
                break;
            case "igual":
                this.addOperation("=");
                break;
            case "ponto":
                this.addOperation(".");
                break;
            case "0":        
            case "1":
            case "2":
            case "3":
            case "4":
            case "5":
            case "6":
            case "7":
            case "8":
            case "9":
            case "10":
                this.addOperation(parseInt(buttonValue));
                break;
            default:
                this.setDisplayResult = "Error";
                break;
        }
    }

    clearDisplayExpression(){
        this.setDisplayResult = "0";
        this._ExpressionCalculate = [];
        this.setLastNumber = "";
        this.setLastNumber = "";
    };

    ce() {
       this.getExpressionCalculate.pop();
       this.printDisplay();
    }

    printDisplay(){
        let numberOfTermsInExpression = this.getExpressionCalculate.length;
        
        if(numberOfTermsInExpression === 2)
            this.setDisplayResult = this.getExpressionCalculate.join("");
        
        else if(numberOfTermsInExpression === 3)
            this.setDisplayResult = this.lastExpressionValue();
        
        else 
            this.setDisplayResult = this.getExpressionCalculate.toString();
    }

    addOperation(currentValue){

        // if the last value of expression is different of number, AND, not exist expression, enter.
        if(isNaN(this.lastExpressionValue())){     

            if(this.isOperator(currentValue) && this.isOperator(this.lastExpressionValue())){
                this._ExpressionCalculate[this.replaceLastExpression()] = currentValue;
            
            }else if( this.isDot(currentValue) || this.isDot(this.lastExpressionValue()) ){
    
                if(this.isOperator(this.lastExpressionValue())){
                    this.pushExpressionCalculate(currentValue)
                }else{
                    let newValue = this.lastExpressionValue().toString() + currentValue.toString();
                    let replaceTheLastExpression = true;
                    this.pushExpressionCalculate(parseFloat(newValue), replaceTheLastExpression);
                }
            }else
                this.pushExpressionCalculate(currentValue)
        }else{

            if(this.isOperator(currentValue)){
                this.pushExpressionCalculate(currentValue);

            }else if( this.isDot(currentValue) && this.expressionCalculateIsEmpty()){
                this.pushExpressionCalculate(currentValue);
                
            }else{
                let newValue = this.lastExpressionValue().toString() + currentValue.toString();
                let replaceTheLastExpression = true;
                this.pushExpressionCalculate(parseFloat(newValue), replaceTheLastExpression);
            }
        }

        this.printDisplay();
    }

    pushExpressionCalculate(value, conditionReplace){
        
        let expressionComplet = 4;
        if(this.expressionCalculateIsEmpty()){
            this.setExpressionCalculate = value;
            return
        }
        if(conditionReplace){
            this._ExpressionCalculate[this.lastIndexOfExpression()] = value;
            return
        
        }else if( this._ExpressionCalculate.length < expressionComplet){
                this.setExpressionCalculate = value;
            if( this._ExpressionCalculate.length === expressionComplet){
                this.calculate();
                return
            }
            return
        }
    }

    calculate(){
        
        let lastOperator = this.getExpressionCalculate.pop();
        
        if( lastOperator == '='){
            if(this._lastOperator == "")
                this.printDisplay();
            //TODO Tratar o caso especifico de que, se tem uma operação realizada e receber multiplos '=', tem que OPERAR(+, -, *) o valor atual com o ultimo numero.            
            else{
                let lastOperatorOfExpression = this.getLastOperatorExpression();
                let lastNumberOfExpression = this.getLastNumberExpression();
                let resultFirstExpression = this.calculateFirstOperation();
            }
        }else if( lastOperator == '%'){
            let resultFirstExpression = this.calculateFirstOperation();
            resultFirstExpression /= 100;
            this._ExpressionCalculate = [resultFirstExpression]

        }else{
            let resultFirstExpression = this.calculateFirstOperation();
            this._ExpressionCalculate = [resultFirstExpression, lastOperator];
        }
    }

    getLastOperatorExpression(){
        let index = this.lastIndexOfExpression();
        
        for(index; index >= 0; index --){
            
            if(this.isOperator(this.getExpressionCalculate[index]))
                this.setLastOperator = this.getExpressionCalculate[index];        
        }

    }

    getLastNumberExpression(){
        let index = this.lastIndexOfExpression();
        
        for(index; index >= 0; index --){
            
            if(!this.isOperator(this.getExpressionCalculate[index]))
                this.setLastNumber = this.getExpressionCalculate[index];        
        }

    }

    calculateFirstOperation(){
        let resultFirstOperation = eval(this.getExpressionCalculate.join(""));
        return resultFirstOperation;
    }

    expressionCalculateIsEmpty(){
        if(this.getExpressionCalculate.length === 0)
            return true;
        else
            return false;
    }

    lastIndexOfExpression(){
        return (this._ExpressionCalculate.length - 1);
    }

    lastExpressionValue(){
        if(this.expressionCalculateIsEmpty())
            return this.getExpressionCalculate;
        return this._ExpressionCalculate[this.lastIndexOfExpression()];
    }

    replaceLastExpression(){
        if(this.expressionCalculateIsEmpty())
            return this._ExpressionCalculate.length
        return this.lastIndexOfExpression();
    }

    isOperator(value){
        return (['+', '-', '*', '%', '/'].indexOf(value) > -1);
    }

    isDot(value){
        if(value == ".")
            return true
        return false
    }


    get getExpressionCalculate(){
        return this._ExpressionCalculate;
    }

    set setExpressionCalculate(value){
        this._ExpressionCalculate.push(value);
    }

    get getDisplayResult(){
        return this._DisplayResult;
    }

    set setDisplayResult(value){
        this._DisplayResult.innerHTML = value;
    }

    get getDisplayHour(){
        return this._displayHour;
    }

    set setDisplayHour(value){
        this._displayHour.innerHTML = value;
    }

    set setLastOperator(value){
        this._lastOperator = value;
    }

    set setLastNumber(value){
        this._lastNumber = value;
    }

    get getDisplayDate(){
        return this._displayDate;
    }

    set setDisplayDate(value){
        this._displayDate.innerHTML = value;
    }

    get currentDate (){
        return new Date;
    }
}

