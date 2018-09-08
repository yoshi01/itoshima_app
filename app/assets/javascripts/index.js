$('tbody tr[data-href]').on("click", function() {
    window.location = $(this).attr('data-href');
});
