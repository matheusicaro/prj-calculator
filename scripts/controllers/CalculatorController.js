
class CalculatorController {
    
    constructor(){
        this._local = ("pt-bt");
        this._lastOperatorSaved = "";
        this._lastNumberSaved = "";
        this._FirstNumberInsertedSaved = "";
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
        this.setLastOperatorInExpression = "";
        this.setLastNumberInExpression = "";
    };

    ce() {
       this.getExpressionCalculate.pop();
       this.printDisplay();
    }

    printDisplay(cleanDisplay){
        let numberOfTermsInExpression = this.getExpressionCalculate.length;

        if( Object.is(numberOfTermsInExpression, 2) )
            this.setDisplayResult = this.getExpressionCalculate.join("");
        
        else if( Object.is(numberOfTermsInExpression, 3) )
            this.setDisplayResult = this.returnLastExpressionValue();
        
        else if( this.isDot(this.getExpressionCalculate.toString()))
            this.setDisplayResult = "0" + this.getExpressionCalculate.toString();
            
        else if(cleanDisplay)
            this.setDisplayResult = "----------";
        else
            this.setDisplayResult = this.getExpressionCalculate.toString();
    }

    addOperation(currentValue){
        let amountElementsCurrent = this.getExpressionCalculate.length;
        // if the last value of expression is different of number, AND, not exist expression, enter.
        if(isNaN(this.returnLastExpressionValue())){     

            if(this.isOperator(currentValue) && this.isOperator(this.returnLastExpressionValue())){
                this._ExpressionCalculate[this.replaceLastExpression()] = currentValue;
            
            }else if( this.isDot(currentValue) || this.isDot(this.returnLastExpressionValue()) ){
    
                if(this.isOperator(this.returnLastExpressionValue())){
                    this.pushExpressionCalculate(currentValue)
                }else{
                    let newValue = this.returnLastExpressionValue().toString() + currentValue.toString();
                    let replaceTheLastExpression = true;
                    this.pushExpressionCalculate(parseFloat(newValue), replaceTheLastExpression);
                }
            }else if( Object.is(amountElementsCurrent, 1) && !isNaN(currentValue)) {
                let newValue = this.returnLastExpressionValue().toString() + currentValue.toString();
                    let replaceTheLastExpression = true;
                    this.pushExpressionCalculate(parseFloat(newValue), replaceTheLastExpression);
        
            }else                                                       //TODO tratar igual antes desse 'else', quando ele vier
                this.pushExpressionCalculate(currentValue)
        }else{

            if(this.isOperator(currentValue)){
                this.pushExpressionCalculate(currentValue);

            }else if( this.isDot(currentValue)){
                if(this.expressionCalculateIsEmpty())
                    this.pushExpressionCalculate(currentValue);
                else{
                    let newValue = this.returnLastExpressionValue().toString() + currentValue.toString() + "0";
                    let replaceTheLastExpression = true;
                    this.pushExpressionCalculate(parseFloat(newValue), replaceTheLastExpression);
                }

            }else if( Object.is(currentValue, '=') ){
                if(this.expressionCalculateIsEmpty()){
                    let cleanDisplay = true;
                    this.printDisplay(cleanDisplay);
                }else
                    this.pushExpressionCalculate(currentValue);
            
            }else{
                let newValue = this.returnLastExpressionValue().toString() + currentValue.toString();
                let replaceTheLastExpression = true;
                this.pushExpressionCalculate(parseFloat(newValue), replaceTheLastExpression);
            }
        }

        this.printDisplay();
    }

    pushExpressionCalculate(currentValue, conditionReplace){
        let maximumOfElements = 4;
        let amountElementsCurrent = this.getExpressionCalculate.length;
        
        if(this.expressionCalculateIsEmpty()){
            this.setExpressionCalculate = currentValue;
            return            
        }
        if(conditionReplace)
            this._ExpressionCalculate[this.lastIndexOfExpression()] = currentValue;
        
        else if( amountElementsCurrent <= maximumOfElements){
            let penultimateExpression = this.returnLastExpressionValue();
            this.setExpressionCalculate = currentValue;
            amountElementsCurrent ++;

            if( this.isOperator(penultimateExpression) && Object.is(currentValue, '=')){
                this.getExpressionCalculate.pop();    
                this.captureLastOperatorAndLastNumber();
                this.setExpressionCalculate = this.getLastNumberInExpression;
                this.setExpressionCalculate = currentValue;
                this.calculate()
            
            }else if( Object.is(amountElementsCurrent, maximumOfElements))
                this.calculate();
            
            else if( Object.is(this.returnLastExpressionValue(), "=") &&  Object.is(amountElementsCurrent, 2) )
                this.getExpressionCalculate.pop();
        }
    }

    calculate(isOperatorEqual){
        
        let lastCurrentOperator = this.getExpressionCalculate.pop();

        if( Object.is(lastCurrentOperator, '=') ){

            this.captureLastOperatorAndLastNumber();
            console.log(this.getLastOperatorInExpression, this.getLastNumberInExpression);

            //TODO Tratar o caso especifico de que, se tem uma operação realizada e receber multiplos '=', tem que OPERAR(+, -, *) o valor atual com o ultimo numero.            
            let resultFirstExpression = this.calculateFirstOperation();
            this._ExpressionCalculate = [resultFirstExpression, this.getLastOperatorInExpression];

        }else if( Object.is(lastCurrentOperator, '%')){
            this.captureLastOperatorAndLastNumber();
            let resultFirstExpression = this.calculateFirstOperation();
            resultFirstExpression /= 100;
            this._ExpressionCalculate = [resultFirstExpression]

        }else{
            this.captureLastOperatorAndLastNumber();
            let resultFirstExpression = this.calculateFirstOperation();
            this._ExpressionCalculate = [resultFirstExpression, lastCurrentOperator];
        }
    }

    captureLastOperatorAndLastNumber(){
        this.returnLastOperatorExpression();
        this.returnLastNumberExpression();
    }

    returnLastOperatorExpression(){
        let index = this.lastIndexOfExpression();
        
        for(index; index >= 0; index --){
            
            if(this.isOperator(this.getExpressionCalculate[index])){
                this.setLastOperatorInExpression = this.getExpressionCalculate[index];
                break
            }
        }
    }

    returnLastNumberExpression(){
        let index = this.lastIndexOfExpression();
        
        for(index; index >= 0; index --){
            
            if(!this.isOperator(this.getExpressionCalculate[index])){
                this.setLastNumberInExpression = this.getExpressionCalculate[index];        
                break
            }
        }
        //  if( Object.is(this.getFirstNumberInsertedSaved, ""))
        //     this.setFirstNumberInsertedSaved = this.getLastNumberInExpression;

    }

    calculateFirstOperation(){
        let resultFirstOperation = eval(this.getExpressionCalculate.join(""));
        return resultFirstOperation;
    }

    expressionCalculateIsEmpty(){
        if( Object.is(this.getExpressionCalculate.length, 0))
            return true;
        else
            return false;
    }

    lastIndexOfExpression(){
        return (this._ExpressionCalculate.length - 1);
    }

    returnLastExpressionValue(){
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
        if( Object.is(value, "."))
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

    get getFirstNumberInsertedSaved(){
        return this._FirstNumberInsertedSaved;
    }

    set setFirstNumberInsertedSaved(value){
        this._FirstNumberInsertedSaved = value;
    }

    get getLastOperatorInExpression(){
        return this._lastOperatorSaved;
    }

    set setLastOperatorInExpression(value){
        this._lastOperatorSaved = value;
    }

    get getLastNumberInExpression(){
        return this._lastNumberSaved;
    }

    set setLastNumberInExpression(value){
        this._lastNumberSaved = value;
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

