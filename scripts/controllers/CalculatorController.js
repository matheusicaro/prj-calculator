
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
        this.setLastNumber = "";
        this.setLastNumber = "";
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
            this.setDisplayResult = this.lastExpressionValue();
        
        else if(cleanDisplay)
            this.setDisplayResult = "----------";
        else
            this.setDisplayResult = this.getExpressionCalculate.toString();
    }

    addOperation(currentValue){

        // if the last value of expression is different of number, AND, not exist expression, enter.
        if(isNaN(this.lastExpressionValue())){     

            if(this.isOperator(currentValue) && this.isOperator(this.lastExpressionValue())){
                this._ExpressionCalculate[this.replaceLastExpression()] = currentValue;
                // this.setLastOperator = currentValue;
            
            }else if( this.isDot(currentValue) || this.isDot(this.lastExpressionValue()) ){
    
                if(this.isOperator(this.lastExpressionValue())){
                    this.pushExpressionCalculate(currentValue)
                }else{
                    let newValue = this.lastExpressionValue().toString() + currentValue.toString();
                    let replaceTheLastExpression = true;
                    this.pushExpressionCalculate(parseFloat(newValue), replaceTheLastExpression);
                }
            }else if( Object.is(currentValue, '=')){

            }else                                                       //TODO tratar igual antes desse 'else', quando ele vier
                // this.setLastNumber = parseFloat(currentValue);
                this.pushExpressionCalculate(currentValue)
        }else{

            if(this.isOperator(currentValue)){
                // this.setLastOperator = currentValue;
                this.pushExpressionCalculate(currentValue);

            }else if( this.isDot(currentValue) && this.expressionCalculateIsEmpty()){
                this.pushExpressionCalculate(currentValue);
           
            }else if( Object.is(currentValue, '=') ){
                if(this.expressionCalculateIsEmpty()){
                    let cleanDisplay = true;
                    this.printDisplay(cleanDisplay);
                    return
                }
                this.pushExpressionCalculate(currentValue);
            
            }else{
                // this.setLastNumber = parseFloat(currentValue);
                let newValue = this.lastExpressionValue().toString() + currentValue.toString();
                let replaceTheLastExpression = true;
                this.pushExpressionCalculate(parseFloat(newValue), replaceTheLastExpression);
            }
        }

        this.printDisplay();
    }

    pushExpressionCalculate(currentValue, conditionReplace){
    
        let termMaximumInExpression = 4;
        if(this.expressionCalculateIsEmpty()){
            this.setExpressionCalculate = currentValue;
            return            
        }
        if(conditionReplace){
            this._ExpressionCalculate[this.lastIndexOfExpression()] = currentValue;
            return
        
        }else if( this._ExpressionCalculate.length < termMaximumInExpression){
            this.setExpressionCalculate = currentValue;
            //TODO se |3|+| proximo for =, vai entrar aqui e tem que ser tratado.
            if( this.isOperator(this.lastExpressionValue()) && Object.is(currentValue, '=')){
                console.log("primeiro salvo..:", this.getFirstNumberInsertedSaved);
                this.getExpressionCalculate.pop();    
                this.setExpressionCalculate = this.getFirstNumberInsertedSaved;
                this.setExpressionCalculate = currentValue;
                this.calculate()
            
            }else if( Object.is(this._ExpressionCalculate.length, termMaximumInExpression))
                this.calculate();
        }
    }

    calculate(isOperatorEqual){
        
        let lastCurrentOperator = this.getExpressionCalculate.pop();

        if( Object.is(lastCurrentOperator, '=') ){
            this.captureLastOperatorAndLastNumber();
            console.log(this.getLastOperator, this.getLastNumber, "..:", this.getExpressionCalculate);

            //TODO Tratar o caso especifico de que, se tem uma operação realizada e receber multiplos '=', tem que OPERAR(+, -, *) o valor atual com o ultimo numero.            
            let resultFirstExpression = this.calculateFirstOperation();
            this._ExpressionCalculate = [resultFirstExpression, this.getLastOperator];
            console.log(this.getLastOperator, this.getLastNumber, "..:", this.getExpressionCalculate);

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
                this.setLastOperator = this.getExpressionCalculate[index];
                break;
            }
        }

    }

    returnLastNumberExpression(){
        let index = this.lastIndexOfExpression();
        
        for(index; index >= 0; index --){
            
            if(!this.isOperator(this.getExpressionCalculate[index])){
                this.setLastNumber = this.getExpressionCalculate[index];        
                break;
            }
        }
        if( Object.is(this.getFirstNumberInsertedSaved, ""))
            this.setFirstNumberInsertedSaved = this.getLastNumber;

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

    get getLastOperator(){
        return this._lastOperatorSaved;
    }

    set setLastOperator(value){
        this._lastOperatorSaved = value;
    }

    get getLastNumber(){
        return this._lastNumberSaved;
    }

    set setLastNumber(value){
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

