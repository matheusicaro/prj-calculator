
class CalculatorController {
    
    constructor(){
        this._local = ("pt-bt");
        this._lastOperatorSaved = "";
        this._lastNumberSaved = "";
        this._FirstNumberInsertedSaved = "";
        this._DisplayResult = document.querySelector('#display');
        this._displayHour = document.querySelector('#hora');
        this._displayDate = document.querySelector('#data');
        this._ElementsForCalculate = [];                            // expressao (vetor)
        
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
                this.buttonAC();
                break;
            case "ce":
                this.buttonCE();
                break;
            case "porcento":
                this.prepareInputElements("%");
                break;
            case "divisao":
                this.prepareInputElements("/");    
                break;
            case "multiplicacao":
                this.prepareInputElements("*");
                break;
            case "subtracao":
                this.prepareInputElements("-");
                break;
            case "soma":
                this.prepareInputElements("+");
                break;
            case "igual":
                this.prepareInputElements("=");
                break;
            case "ponto":
                this.prepareInputElements(".");
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
                this.prepareInputElements(parseInt(buttonValue));
                break;
            default:
                this.setDisplayResult = "Error";
                break;
        }
    }
    
    buttonAC(){
        this.setDisplayResult = "0";
        this._ElementsForCalculate = [];
        this.setLastOperatorInExpression = "";
        this.setLastNumberInExpression = "";
    };

    buttonCE() {
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
        this.setDisplayWasPrinted = true;
        
        if(cleanDisplay)
            this.setDisplayResult = "----------";
        else if(this.expressionCalculateIsEmpty())
            this.setDisplayResult = "0";
        else
            this.setDisplayResult = value;
    }

    prepareInputElements(currentValue){

        let amountElementsCurrent = this.getElementsForCalculate.length;
        let lastElementInOperation = this.returnLastElementInOperation();
        this.setDisplayWasPrinted = false;

        if(isNaN(this.returnLastElementInOperation())){     

            if(this.isOperator(currentValue) && this.isOperator(lastElementInOperation)){
                this.replaceLastElementInOperation(currentValue);
            
            }else if( this.isDot(currentValue) || this.isDot(lastElementInOperation) ){
                if(this.isOperator(lastElementInOperation)){
                    this.addExpressionToCalculate(currentValue)
                }else{
                    this.addNumberToCalculate(lastElementInOperation, currentValue);
                }

            }else if( Object.is(amountElementsCurrent, 1) && !isNaN(currentValue)) {
                this.addNumberToCalculate(lastElementInOperation, currentValue);
       
            }else
                this.addExpressionToCalculate(currentValue)
        
        }else{
            if( !isNaN(currentValue) ){
                this.addNumberToCalculate(lastElementInOperation, currentValue);
            
            }else if( this.isOperator(currentValue) ){
                this.addExpressionToCalculate(currentValue);

            }else if( this.isDot(currentValue) ){
                if(this.expressionCalculateIsEmpty())
                    this.addExpressionToCalculate(currentValue);
                else{
                    let complementForNumberFloat = "0";
                    this.addNumberToCalculate(lastElementInOperation, currentValue, complementForNumberFloat);
                }

            }else if( this.isOperatorEqual(currentValue) ){
                if(this.expressionCalculateIsEmpty()){
                    let cleanDisplay = true;
                    return this.printDisplay(currentValue, cleanDisplay);
                }else
                    this.addExpressionToCalculate(currentValue);
            }
        }

        if(!this.getAlReadyPrinted)
            this.printDisplay(currentValue);
    }

    addNumberToCalculate(lastElementInOperation, currentValue, complementForNumberFloat){
        
        if(complementForNumberFloat){
            let newValue = parseFloat( lastElementInOperation.toString() + currentValue.toString() + complementForNumberFloat );
            this.replaceLastElementInOperation(newValue);
            this.printDisplay(newValue);
        
        }else{
            let newValue = parseFloat( lastElementInOperation.toString() + currentValue.toString() );
            this.replaceLastElementInOperation(newValue);
            this.printDisplay(newValue);
        }
    }

    addExpressionToCalculate(currentValue){
        let maximumOfElements = 4;
        let amountElementsCurrent = this.getElementsForCalculate.length;
        
        if(this.expressionCalculateIsEmpty())
            this.inserElementForOperation(currentValue);
        
        else if( amountElementsCurrent <= maximumOfElements ){
            let penultimateExpression = this.returnLastElementInOperation();
            this.inserElementForOperation(currentValue);
            amountElementsCurrent ++;

            if( this.isOperator(penultimateExpression) && this.isOperatorEqual(currentValue) ){
                this.removeLastElementsInOperation();
                this.captureLastOperatorAndLastNumber();
                this.inserAllElementForOperation(this.getLastNumberCalculated, currentValue);
                this.calculate()
            
            }else if( Object.is(amountElementsCurrent, maximumOfElements)){
                this.captureLastOperatorAndLastNumber();
                this.calculate();
            }        
            else if( this.isOperatorEqual(this.returnLastElementInOperation()) &&  Object.is(amountElementsCurrent, 2) )
                this.removeLastElementsInOperation();
        }else{
            console.log("*** Exception: " + "\n"
                        + "207..: addExpressionToCalculate()"
                        + "Current Value" + currentValue + "\n"
                        + "Elements in Operation" + this.getElementsForCalculate );
        }
    }

    calculate(){
        
        let lastElement = this.getElementsForCalculate.pop();

        if( this.isOperatorEqual(lastElement) ){

            //TODO Tratar o caso especifico de que, se tem uma operação realizada e receber multiplos '=', tem que OPERAR(+, -, *) o valor atual com o ultimo numero.            
            let resultFirstTerm = this.calculateFirstTermOfOperation();
            this._ElementsForCalculate = [resultFirstTerm, this.getLastOperatorOfTheExpression];
            this.printDisplay(resultFirstTerm);

        }else if( Object.is(lastElement, '%')){

            let resultFirstTerm = this.calculateFirstTermOfOperation();
            resultFirstTerm /= 100;
            this._ElementsForCalculate = [resultFirstTerm]
            this.printDisplay(resultFirstTerm);

        }else{

            let resultFirstTerm = this.calculateFirstTermOfOperation();
            this._ElementsForCalculate = [resultFirstTerm, lastElement];
            this.printDisplay(resultFirstTerm);
        }
    }

    captureLastOperatorAndLastNumber(){
        this.returnLastOperatorExpression();
        this.returnLastNumberExpression();
    }

    returnLastOperatorExpression(){
        let index = this.lastIndexOfExpression();
        
        for(index; index >= 0; index --){
            
            if(this.isOperator(this.getElementsForCalculate[index])){
                this.setLastOperatorInExpression = this.getElementsForCalculate[index];
                break
            }
        }
    }

    returnLastNumberExpression(){
        let index = this.lastIndexOfExpression();
        
        for(index; index >= 0; index --){
            
            if(!this.isOperator(this.getElementsForCalculate[index])){
                this.setLastNumberInExpression = this.getElementsForCalculate[index];        
                break
            }
        }
    }

    calculateFirstTermOfOperation(){
        let resultFirstOperation = eval(this.getElementsForCalculate.join(""));
        return resultFirstOperation;
    }

    expressionCalculateIsEmpty(){
        if( Object.is(this.getElementsForCalculate.length, 0))
            return true;
        else
            return false;
    }

    lastIndexOfExpression(){
        if(this.expressionCalculateIsEmpty())
            return this._ElementsForCalculate.length;
        else
            return (this._ElementsForCalculate.length - 1);
    }

    returnLastElementInOperation(){
        if(this.expressionCalculateIsEmpty())
            return this.getElementsForCalculate;
        return this._ElementsForCalculate[this.lastIndexOfExpression()];
    }

    replaceLastElementInOperation(value){
        if(this.expressionCalculateIsEmpty())
            this.inserElementForOperation(value);
        else
            this._ElementsForCalculate[this.lastIndexOfExpression()] = value;
    }

    isOperator(value){
        return (['+', '-', '*', '%', '/'].indexOf(value) > -1);
    }

    isDot(value){
        if( Object.is(value, "."))
            return true
        return false
    }

    isOperatorEqual(value){
        if( Object.is(value, "="))
            return true
        return false
    }

    removeLastElementsInOperation(){
        this.getElementsForCalculate.pop();
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

    get getElementsForCalculate(){
        return this._ElementsForCalculate;
    }

    set setExpressionCalculate(value){
        this._ElementsForCalculate.push(value);
    }

    // get getDisplayResult(){
    //     return this._DisplayResult;
    // }

    set setDisplayResult(value){
        this._DisplayResult.innerHTML = value;
    }

    // get getDisplayHour(){
    //     return this._displayHour;
    // }

    set setDisplayHour(value){
        this._displayHour.innerHTML = value;
    }

    // get getFirstNumberInsertedSaved(){
    //     return this._FirstNumberInsertedSaved;
    // }

    // set setFirstNumberInsertedSaved(value){
    //     this._FirstNumberInsertedSaved = value;
    // }

    get getLastOperatorOfTheExpression(){
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

    set setDisplayWasPrinted(value){
        this._alReadyPrinted = value;
    }

    // get getDisplayDate(){
    //     return this._displayDate;
    // }

    set setDisplayDate(value){
        this._displayDate.innerHTML = value;
    }

    get currentDate (){
        return new Date;
    }
}

