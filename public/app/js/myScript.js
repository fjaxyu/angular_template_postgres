(function () {
    // Your code here
    function resize() {
        var heights = window.innerHeight;
        document.getElementById('wrap').style.minHeight = heights - 50 + 'px';
    }
    
    var updateColors = function () {
        $('.navbar').css('background', '#333');
        $('#footer').css('background', '#333');
    };

    $(document).ready(function () {
        resize();
        updateColors();
    });

    window.onresize = function () {
        resize();
    };

    // Expose global variables with the window object:
    //    window.varName = varName;
})();
