let selectedType;
let a;
let b;
let c;
let d;
let e;

function selectType(type) {
        this.selectedType == type;
        $('#type-i').removeClass("btn-warning");
        $('#type-i').addClass("btn-outline-warning");
        $('#type-t').removeClass("btn-warning");
        $('#type-t').addClass("btn-outline-warning");
        $('#type-r').removeClass("btn-warning");
        $('#type-r').addClass("btn-outline-warning");

        $('#type-'+type).removeClass("btn-outline-warning");
        $('#type-'+type).addClass("btn-warning");
        $('#selected-type').text('Selected Beam Type : '+type+' Beam');
}

function moveStep(step){
    $('#step-1').hide();
    $('#step-2').hide();
    $('#step-3').hide();

    $('#step-indicator-1').removeClass('active');
    $('#step-indicator-2').removeClass('active');
    $('#step-indicator-3').removeClass('active');

    $('#step-'+step).show();
    $('#step-indicator-'+step).addClass('active');

}
