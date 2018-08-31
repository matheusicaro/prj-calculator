
class CalculatorController {
    
    constructor(){
        this._local = ("pt-bt");
        this._lastOperatorSaved = "";
        this._lastNumberSaved = "";
        this._FirstNumberInsertedSaved = "";
        this._displayCopy = "";
        this._DisplayResult = document.querySelector('#display');
        this._displayHour = document.querySelector('#hora');
        this._displayDate = document.querySelector('#data');
        this._ElementsOperation = [];                            
        
        this._displayWasPrinted = false;
        this.initialize();
        this.initButtonsEvents();
        this.initKeyBoardEvents();
    }
    
    initialize(){
        
        let time = 1000;
        setInterval(() =>{
            let currentDate = this.currentDate;
            this.setDisplayDate = currentDate.toLocaleDateString(this._local);
            this.setDisplayHour = currentDate.toLocaleTimeString(this._local);
        }, time);

        this.pasteFromClipboard();
  
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

    copyToClipboard(){
        
        let input = document.createElement('input');
        input.value = this._displayCopy;
        document.body.appendChild(input);
        input.select();

        document.execCommand("Copy");
        input.remove();
    }

    pasteFromClipboard(){

        document.addEventListener('paste', e =>{

            let text = e.clipboardData.getData('Text');
            console.log(text);
            this.setDisplayResult = parseFloat(text);
        })
    }

    initKeyBoardEvents(){
        document.addEventListener('keyup', buttonKeyBoard =>{

            switch (buttonKeyBoard.key) {
                case "Escape":
                    this.buttonAC();
                    break;
                case "Backspace":
                    this.buttonCE();
                    break;
                case "%":
                case "/":
                case "*":
                case "-":
                case "+":
                this.prepareInputElements(buttonKeyBoard.key);
                break;
                case "=":
                case "Enter":
                    this.prepareInputElements("=");
                    break;
                case ".":
                    this.prepareInputElements(buttonKeyBoard.key);
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
                    this.prepareInputElements(parseInt(buttonKeyBoard.key));
                    break;
                
                case "c":
                    if(buttonKeyBoard.ctrlKey)
                        this.copyToClipboard();
                    break;
            }
        });

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
                this.printDisplay("Error");
                break;
        }
    }
    
    buttonAC(){
        this.setDisplayResult = "0";
        this._ElementsOperation = [];
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
        else if(this.isEmptyElementsOperation())
            this.setDisplayResult = "0";
        else
            this.setDisplayResult = value;
    }

    prepareInputElements(currentValue){

        let amountElementsCurrent = this.getElementOperation.length;
        let lastElementInOperation = this.returnLastElementInOperation();
        this.setDisplayWasPrinted = false;

        if( Object.is(amountElementsCurrent, 1) && this.isOperatorEqual(currentValue) ){
            if( !isNaN(lastElementInOperation))                              
                this.printDisplay(lastElementInOperation);              
            else                                                         
                this.clearDisplayResult();                                          
        }else if(isNaN(this.returnLastElementInOperation())){     

            if(this.isOperator(currentValue) && this.isOperator(lastElementInOperation)){
                this.replaceLastElementInOperation(currentValue);
            
            }else if( this.isDot(currentValue) || this.isDot(lastElementInOperation) ){
                if(this.isOperator(lastElementInOperation)){
                    this.addExpressionToCalculate(currentValue)
                }else{
                    this.addNumberToCalculate(lastElementInOperation, currentValue);
                }

            }else
                this.addExpressionToCalculate(currentValue)
        
        }else{
            if( !isNaN(currentValue) ){
                if(this.isEmptyElementsOperation())
                    this.addExpressionToCalculate(currentValue);
                else
                    this.addNumberToCalculate(lastElementInOperation, currentValue);
            
            }else if( this.isOperator(currentValue) ){
                this.addExpressionToCalculate(currentValue);

            }else if( this.isDot(currentValue) ){
                if(this.isEmptyElementsOperation())
                    this.addExpressionToCalculate(currentValue);
                else{
                    let complementForNumberFloat = "0";
                    this.addNumberToCalculate(lastElementInOperation, currentValue, complementForNumberFloat);
                }

            }else if( this.isOperatorEqual(currentValue) ){
                if(this.isEmptyElementsOperation()){
                    let cleanDisplay = true;
                    return this.printDisplay(currentValue, cleanDisplay);
                }else
                    this.addExpressionToCalculate(currentValue);
            }
        }

        if(!this.getDisplayWasPrinted)
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
        let amountElementsCurrent = this.getElementOperation.length;
        
        if(this.isEmptyElementsOperation())
            this.inserElementsOperation(currentValue);
        
        else if( amountElementsCurrent <= maximumOfElements ){
            let penultimateExpression = this.returnLastElementInOperation();
            this.inserElementsOperation(currentValue);
            amountElementsCurrent ++;

            if( this.isOperator(penultimateExpression) && this.isOperatorEqual(currentValue) ){
                this.removeLastElementsInOperation();
                this.captureLastOperatorAndNumber();
                this.insertAllElementsOperation(this.getLastNumberCalculated, currentValue);
                this.calculate()
                console.log("TEst")
            }else if( Object.is(amountElementsCurrent, maximumOfElements)){
                this.captureLastOperatorAndNumber();
                this.calculate();
            }        
            else if( this.isOperatorEqual(this.returnLastElementInOperation()) &&  Object.is(amountElementsCurrent, 2) )
                this.removeLastElementsInOperation();
        }else{
            console.log("*** Exception: " + "\n"
                        + "207..: addExpressionToCalculate()"
                        + "Current Value" + currentValue + "\n"
                        + "Elements in Operation" + this.getElementOperation );
        }
    }

    calculate(){
        
        let lastElement = this.getElementOperation.pop();

        if( this.isOperatorEqual(lastElement) ){

            //TODO Tratar o caso especifico de que, se tem uma operação realizada e receber multiplos '=', tem que OPERAR(+, -, *) o valor atual com o ultimo numero.            
            let resultFirstTerm = this.calculateFirstTermOfOperation();
            this._ElementsOperation = [resultFirstTerm, this.getLastOperatorOfTheExpression];
            this.printDisplay(resultFirstTerm);

        }else if( Object.is(lastElement, '%')){

            let resultFirstTerm = this.calculateFirstTermOfOperation();
            resultFirstTerm /= 100;
            this._ElementsOperation = [resultFirstTerm]
            this.printDisplay(resultFirstTerm);

        }else{

            let resultFirstTerm = this.calculateFirstTermOfOperation();
            this._ElementsOperation = [resultFirstTerm, lastElement];
            this.printDisplay(resultFirstTerm);
        }
    }

    captureLastOperatorAndNumber(){
        this.returnLastOperatorInElementsOperation();
        this.returnLastNumberInElementsOperation();
    }

    returnLastOperatorInElementsOperation(){
        let index = this.returnIndexLastElementInOperation();
        let lastOperator;
        for(index; index >= 0; index --){
            
            if(this.isOperator(this.getElementOperation[index])){
                this.setLastOperatorInExpression = this.getElementOperation[index];
                lastOperator = this.getElementOperation[index];
                break
            }
        }
        return lastOperator;
    }

    returnLastNumberInElementsOperation(){
        let index = this.returnIndexLastElementInOperation();
        let lastNumber;
        for(index; index >= 0; index --){
            
            if(!this.isOperator(this.getElementOperation[index])){
                this.setLastNumberInExpression = this.getElementOperation[index];        
                lastNumber = this.getElementOperation[index];
                break;
            }
        }
        return lastNumber;
    }

    calculateFirstTermOfOperation(){
        let resultFirstOperation = eval(this.getElementOperation.join(""));
        return resultFirstOperation;
    }

    isEmptyElementsOperation(){
        if( Object.is(this.getElementOperation.length, 0))
            return true;
        else
            return false;
    }

    returnIndexLastElementInOperation(){
        if(this.isEmptyElementsOperation())
            return this._ElementsOperation.length;
        else
            return (this._ElementsOperation.length - 1);
    }

    returnLastElementInOperation(){
        if(this.isEmptyElementsOperation())
            return this.getElementOperation;
        return this._ElementsOperation[this.returnIndexLastElementInOperation()];
    }

    replaceLastElementInOperation(value){
        if(this.isEmptyElementsOperation())
            this.inserElementsOperation(value);
        else
            this._ElementsOperation[this.returnIndexLastElementInOperation()] = value;
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
        this.getElementOperation.pop();
    }

    inserElementsOperation(value){
        this.setElementsOperation = value;
    }

    insertAllElementsOperation(value_1, value_2){
        console.log("valores: ", value_1, value_2)
        if(value_1)
            this.setElementsOperation = value_1;
        if(value_2)
            this.setElementsOperation = value_2;
    }

    removeLastChar(value){
        value = value.toString();
        value = value.substring(0, value.length - 1)
        return value;
    }

    clearDisplayResult(){
        this.printDisplay("0");
    }

    get getElementOperation(){
        return this._ElementsOperation;
    }

    set setElementsOperation(value){
        this._ElementsOperation.push(value);
    }

    set setDisplayResult(value){
        this._displayCopy = value;
        this._DisplayResult.innerHTML = value;
    }

    set setDisplayHour(value){
        this._displayHour.innerHTML = value;
    }

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

    get getDisplayWasPrinted(){
        return this._displayWasPrinted;
    }

    set setDisplayWasPrinted(value){
        this._displayWasPrinted= value;
    }

    set setDisplayDate(value){
        this._displayDate.innerHTML = value;
    }

    get currentDate (){
        return new Date;
    }
}

