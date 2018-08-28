
class CalculatorController {
    
    constructor(){
        this._local = ("pt-bt");
        this._lastOperatorSaved = "";
        this._lastNumberSaved = "";
        this._FirstNumberInsertedSaved = "";
        this._DisplayResult = document.querySelector('#display');
        this._displayHour = document.querySelector('#hora');
        this._displayDate = document.querySelector('#data');
        this._allElementsInOperator = [];                            // expressao (vetor)
        
        this._alReadyPrinted = false;
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
        this._allElementsInOperator = [];
        this.setLastOperatorInExpression = "";
        this.setLastNumberInExpression = "";
        this.setAlReadyPrinted = false;
    };

    ce() {
        let lastElementInOperation = this.returnLastElementInOperation();

        if(isNaN(lastElementInOperation)){
            this.removeLastElementsInOperation();
            this.printDisplay(this.returnLastElementInOperation());
            return
        
        }else{
            let newValue = this.removeLastChar(lastElementInOperation);
            if(newValue != ""){
                this.replaceLastElementInOperation(newValue);
                this.printDisplay(this.returnLastElementInOperation());
            }else
                this.printDisplay(this.returnLastElementInOperation());
        }
    }

    printDisplay(value, cleanDisplay){
        let numberOfTermsInExpression = this.getAllElementsInOperator.length;
        if(cleanDisplay)
            this.setDisplayResult = "----------";
        else if(this.expressionCalculateIsEmpty())
            this.setDisplayResult = "0";
        else
            this.setDisplayResult = value;
    }

    addOperation(currentValue){
        let amountElementsCurrent = this.getAllElementsInOperator.length;
        this.setAlReadyPrinted = false;
        // if the last value of expression is different of number, AND, not exist expression, enter.
        if(isNaN(this.returnLastElementInOperation())){     

            if(this.isOperator(currentValue) && this.isOperator(this.returnLastElementInOperation())){
                this.replaceLastElementInOperation(currentValue);
            
            }else if( this.isDot(currentValue) || this.isDot(this.returnLastElementInOperation()) ){
    
                if(this.isOperator(this.returnLastElementInOperation())){
                    this.pushExpressionCalculate(currentValue)
                }else{
                    let newValue = this.returnLastElementInOperation().toString() + currentValue.toString();
                    let replaceTheLastExpression = true;
                    this.pushExpressionCalculate(parseFloat(newValue), replaceTheLastExpression);
                }
            }else if( Object.is(amountElementsCurrent, 1) && !isNaN(currentValue)) {
                let newValue = this.returnLastElementInOperation().toString() + currentValue.toString();
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
                    let newValue = this.returnLastElementInOperation().toString() + currentValue.toString() + "0";
                    let replaceTheLastExpression = true;
                    this.pushExpressionCalculate(parseFloat(newValue), replaceTheLastExpression);
                }

            }else if( Object.is(currentValue, '=') ){
                if(this.expressionCalculateIsEmpty()){
                    let cleanDisplay = true;
                    return this.printDisplay(currentValue, cleanDisplay);
                }else
                    this.pushExpressionCalculate(currentValue);
            
            }else{          //TODO Melhorar condição, trocar 'else' por 'else if(é um numero)'
                let newValue = this.returnLastElementInOperation().toString() + currentValue.toString();
                let replaceTheLastExpression = true;
                this.pushExpressionCalculate(parseFloat(newValue), replaceTheLastExpression);
            }
        }
        if(!this.getAlReadyPrinted)
            this.printDisplay(currentValue);
    }

    pushExpressionCalculate(currentValue, replaceTheLastExpression){
        let maximumOfElements = 4;
        let amountElementsCurrent = this.getAllElementsInOperator.length;
        
        if(this.expressionCalculateIsEmpty()){
            this.inserElementForOperation(currentValue);
            return            
        }
        if(replaceTheLastExpression){
            this._allElementsInOperator[this.lastIndexOfExpression()] = currentValue;
            this.printDisplay(currentValue);
            this.setAlReadyPrinted = true;
        
        }else if( amountElementsCurrent <= maximumOfElements){
            let penultimateExpression = this.returnLastElementInOperation();
            this.inserElementForOperation(currentValue);
            amountElementsCurrent ++;

            if( this.isOperator(penultimateExpression) && Object.is(currentValue, '=')){
                this.getAllElementsInOperator.pop();    
                this.captureLastOperatorAndLastNumber();
                this.inserAllElementForOperation(this.getLastNumberCalculated, currentValue);
                this.calculate()
            
            }else if( Object.is(amountElementsCurrent, maximumOfElements))
                this.calculate();
            
            else if( Object.is(this.returnLastElementInOperation(), "=") &&  Object.is(amountElementsCurrent, 2) )
                this.getAllElementsInOperator.pop();
        }
    }

    calculate(isOperatorEqual){
        
        let lastCurrentOperator = this.getAllElementsInOperator.pop();

        if( Object.is(lastCurrentOperator, '=') ){

            this.captureLastOperatorAndLastNumber();
            //TODO Tratar o caso especifico de que, se tem uma operação realizada e receber multiplos '=', tem que OPERAR(+, -, *) o valor atual com o ultimo numero.            
            let resultFirstExpression = this.calculateFirstOperation();
            this._allElementsInOperator = [resultFirstExpression, this.getLastOperatorInExpression];
            this.printDisplay(resultFirstExpression);
            this.setAlReadyPrinted = true;

        }else if( Object.is(lastCurrentOperator, '%')){
            this.captureLastOperatorAndLastNumber();
            let resultFirstExpression = this.calculateFirstOperation();
            resultFirstExpression /= 100;
            this._allElementsInOperator = [resultFirstExpression]
            this.printDisplay(resultFirstExpression);
            this.setAlReadyPrinted = true;

        }else{
            this.captureLastOperatorAndLastNumber();
            let resultFirstExpression = this.calculateFirstOperation();
            this._allElementsInOperator = [resultFirstExpression, lastCurrentOperator];
            this.printDisplay(resultFirstExpression);
            this.setAlReadyPrinted = true;
        }
    }

    captureLastOperatorAndLastNumber(){
        this.returnLastOperatorExpression();
        this.returnLastNumberExpression();
    }

    returnLastOperatorExpression(){
        let index = this.lastIndexOfExpression();
        
        for(index; index >= 0; index --){
            
            if(this.isOperator(this.getAllElementsInOperator[index])){
                this.setLastOperatorInExpression = this.getAllElementsInOperator[index];
                break
            }
        }
    }

    returnLastNumberExpression(){
        let index = this.lastIndexOfExpression();
        
        for(index; index >= 0; index --){
            
            if(!this.isOperator(this.getAllElementsInOperator[index])){
                this.setLastNumberInExpression = this.getAllElementsInOperator[index];        
                break
            }
        }
        //  if( Object.is(this.getFirstNumberInsertedSaved, ""))
        //     this.setFirstNumberInsertedSaved = this.getLastNumberCalculated;

    }

    calculateFirstOperation(){
        let resultFirstOperation = eval(this.getAllElementsInOperator.join(""));
        return resultFirstOperation;
    }

    expressionCalculateIsEmpty(){
        if( Object.is(this.getAllElementsInOperator.length, 0))
            return true;
        else
            return false;
    }

    lastIndexOfExpression(){
        if(this.expressionCalculateIsEmpty())
            return this._allElementsInOperator.length;
        else
            return (this._allElementsInOperator.length - 1);
    }

    returnLastElementInOperation(){
        if(this.expressionCalculateIsEmpty())
            return this.getAllElementsInOperator;
        return this._allElementsInOperator[this.lastIndexOfExpression()];
    }

    replaceLastElementInOperation(value){
        this._allElementsInOperator[this.lastIndexOfExpression()] = value;
    }

    isOperator(value){
        return (['+', '-', '*', '%', '/'].indexOf(value) > -1);
    }

    isDot(value){
        if( Object.is(value, "."))
            return true
        return false
    }

    removeLastElementsInOperation(){
        this.getAllElementsInOperator.pop();
    }

    inserElementForOperation(value){
        this.setExpressionCalculate = value;
    }

    inserAllElementForOperation(value_1, value_2){
        if(value_1)
            this.setExpressionCalculate = value_1;
        if(value_2)
            this.setExpressionCalculate = value_2;
    }

    removeLastChar(value){
        value = value.toString();
        value = value.substring(0, value.length - 1)
        return value;
    }

    get getAllElementsInOperator(){
        return this._allElementsInOperator;
    }

    set setExpressionCalculate(value){
        this._allElementsInOperator.push(value);
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

    get getLastNumberCalculated(){
        return this._lastNumberSaved;
    }

    set setLastNumberInExpression(value){
        this._lastNumberSaved = value;
    }

    get getAlReadyPrinted(){
        return this._alReadyPrinted;
    }

    set setAlReadyPrinted(value){
        this._alReadyPrinted = value;
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

