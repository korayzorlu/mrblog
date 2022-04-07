$(document).ready( function () {
    var table = $('#dataTable').DataTable( {
        responsive: true,
        columnDefs: [ {
            orderable: false,
            className: 'select-checkbox',
            defaultContent: "",
            targets:   [0],
        } ],
        "dom": '<"top"lrpft><"bottom"tip>',
        select: {
            style:    'multi',
            selector: 'td:first-child',
        },
        buttons: [
            {
                text: 'Tümünü Seç',
                action: function () {
                    table.rows().select();
                }
            },
            {
                text: 'Seçimi Kaldır',
                action: function () {
                    table.rows().deselect();
                }
            }
        ],
        order: [[ 1, 'asc' ]],
        "bDestroy": true,
        "lengthMenu": [[20, 50, 100, -1], [20, 50, 100, "Tümü"]],
        /*
        "processing": true,
	    "serverSide": true,
        "paging": true,
        "pageLength": 20,
	    "ajax": { 
		    url: "/user/restapi/products/?format=datatables",
	    },
        "columns": [
            "",
            { "data": "title", "searchable":true },
            { "data": "barcode" },
            { "data": "sku" },
            { "data": "brand" },
            { "data": "quantity" },
            { "data": "sale_price" }
            { "data": "images", render: function (data, type, row, meta) {
                return '<img src="' + data + '" height="50" width="50"/>';
              }}
        ]
        */
    } );
    table.on( 'select', function ( e, dt, type, indexes ) {
        document.getElementById("allRemove").style.display='block';
    } );
    table.on( 'deselect', function ( e, dt, type, indexes ) {
        if( table.rows('.selected').data().length === 0){
            document.getElementById("allRemove").style.display='none';
        }
    } );
    $('#checkAllProducts').click(function(){
        if($(this).is(':checked')){
            table.rows().select();
            document.getElementById("allRemove").style.display='block';
        } else {
            table.rows().deselect();
            document.getElementById("allRemove").style.display='none';
        }
    });
    $('#allRRemove').click( function () {
        var dataArr = [];
        $.each($("#dataTable tr.selected"),function(){
            dataArr.push($(this).find('td').eq(2).text()); 
        });
        table.rows('.selected').remove().draw( false );
        for (let i = 0; i < dataArr.length; i++) {
            window.location = "/user/deleteproducts/"+dataArr;
        }
    } );
    //Remove Rows
    $('#allRemove').click( function () {
        Swal.fire({
            title: 'Satırlar silinsin mi?',
            text: "Seçili satırlar kalıcı olarak tablodan silinecektir.",
            icon: 'warning',
            showCancelButton: true,
            confirmButtonColor: '#3085d6',
            cancelButtonColor: '#d33',
            confirmButtonText: 'Sil',
            cancelButtonText: 'Vazgeç'
        }).then((result) => {
        if (result.isConfirmed) {
            var dataArr = [];
            $.each($("#dataTable tr.selected"),function(){
                dataArr.push($(this).find('td').eq(1).text()); 
            });
            table.rows('.selected').remove().draw( false );
            for (let i = 0; i < dataArr.length; i++) {
                window.location = "/delete/"+dataArr;
            }
            Swal.fire(
            'Silindi!',
            'Satırlar başarıyla silindi.',
            'success'
            )
        }
        })
    } );
    //Add Rows
    $('#addRow').click( function () {
        Swal.fire({
            title: 'Başlık gir',
            input: 'text',
            inputAttributes: {
              autocapitalize: 'off'
            },
            showCancelButton: true,
            confirmButtonText: 'Kaydet',
            cancelButtonText: 'Vazgeç',
            showLoaderOnConfirm: true,
            preConfirm: (title) => {
              return fetch(`/add/${title}`)
                .then(response => {
                  if (!response.ok) {
                    throw new Error(response.statusText)
                  }
                  return response
                })
                .catch(error => {
                  Swal.showValidationMessage(
                    `Hata: ${error}`
                  )
                })
            },
            allowOutsideClick: () => !Swal.isLoading()
        }).then((result) => {
        if (result.isConfirmed) {
            Swal.fire(
                'Başarılı!',
                'Başlık tabloya eklendi.',
                'success'
                )
            .then(function(){ 
                location.reload();
                })
        }
        })
    } );
} );
