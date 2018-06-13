var prefix = "celltype";
$(document).ready(function(){
	// hide submit buttons for imgDown
	$('.ImgDownSubmit').hide();
	$('#cellSubmit').attr("disabled", true);

	// hash activate
	var hashid = window.location.hash;
	if(hashid==""){
		$('a[href="#newJob"]').trigger('click');
	}else{
		$('a[href="'+hashid+'"]').trigger('click');
	}

	getJobList();
	$('#refreshTable').on('click', function(){
		getJobList();
	});

	// Get SNP2GENE job IDs
	$.ajax({
		url: subdir+"/celltype/getS2GIDs",
		type: "POST",
		error: function(){
			alert("error for getS2GIDs");
		},
		success: function(data){
			$('#s2gID').html('<option value=0 selected>None</option>');
			data.forEach(function(d){
				$('#s2gID').append('<option value='+d.jobID+'>'+d.jobID+' ('+d.title+')</option>');
			})
		},
		complete: function(){
			CheckInput();
		}
	})

	// Delete jobs
	$('#deleteJob').on('click', function(){
		swal({
			title: "Are you sure?",
			text: "Do you really want to remove selected jobs?",
			type: "warning",
			showCancelButton: true,
			closeOnConfirm: true,
		}, function(isConfirm){
			if (isConfirm){
				$('.deleteJobCheck').each(function(){
					if($(this).is(":checked")){
						$.ajax({
							url: subdir+'/'+page+'/deleteJob',
							type: "POST",
							data: {
								jobID: $(this).val()
							},
							error: function(){
								alert("error at deleteJob");
							},
							complete: function(){
								getJobList();
							}
						});
					}
				});
			}
		});
	});
});

function CheckInput(){
	check = true;
	s2gID = $('#s2gID').val();
	fileName = $('#genes_raw').val();
	ds = 0;
	$('#cellDataSets option').each(function(){
		if($(this).is(":selected")){ds++;}
	});

	if(s2gID==0 && fileName.length==0){
		check = false;
		$('#CheckInput').html('<div class="alert alert-danger" style="padding-bottom: 10; padding-top: 10;">Please either select SNP2GENE jobID or upload a file.</div>')
	}else{
		if(ds==0){
			check = false;
			$('#CheckInput').html('<div class="alert alert-danger" style="padding-bottom: 10; padding-top: 10;">Please select at least one single-cell expression data set.</div>')
		}else if(s2gID>0){
			var filecheck = false;
			$.ajax({
				url: subdir+"/celltype/checkMagmaFile",
				type: 'POST',
				data: { id: s2gID },
				error: function(){alert("error from checkMagmaFile")},
				success: function(data){
					if(data==1){filecheck=true}
				},
				complete: function(){
					if(!filecheck){
						check = false;
						$('#CheckInput').html('<div class="alert alert-danger" style="padding-bottom: 10; padding-top: 10;">The seleted SNP2GENE job does not have valid MAGMA output.</div>')
					}else if(fileName.length>0){
						$('#CheckInput').html('<div class="alert alert-warning" style="padding-bottom: 10; padding-top: 10;">Both SNP2GENE job ID and upload file are provided. Selected SNP2GENE job will be used.</div>')
					}else{
						$('#CheckInput').html('<div class="alert alert-success" style="padding-bottom: 10; padding-top: 10;">OK. The MAGMA gene analysis results will be obtained from the selected SNP2GENE job.</div>')
					}
				}
			});
		}else{
			if(fileName.endsWith(".genes.raw")){
				$('#CheckInput').html('<div class="alert alert-success" style="padding-bottom: 10; padding-top: 10;">OK. The selected file will be uploaded.</div>')
			}else{
				check = false;
				$('#CheckInput').html('<div class="alert alert-danger" style="padding-bottom: 10; padding-top: 10;">The seleted file does not have extension "genes.raw".</div>')
			}
		}
	}

	if(check){$('#cellSubmit').attr("disabled", false);}
	else{$('#cellSubmit').attr("disabled", true);}
}

function getJobList(){
	$('#joblist table tbody')
		.empty()
		.append('<tr><td colspan="7" style="text-align:center;">Retrieving data</td></tr>');
	$.getJSON( subdir+'/'+page+'/getJobList', function( data ){
		var items = '<tr><td colspan="7" style="text-align: center;">No Jobs Found</td></tr>';
		if(data.length){
			items = '';
			$.each( data, function( key, val ) {
				if(val.status == 'OK'){
					val.status = '<a href="'+subdir+'/'+page+'/'+val.jobID+'">Go to results</a>';
				}
				items = items + "<tr><td>"+val.jobID+"</td><td>"+val.title
					+"</td><td>"+val.snp2gene+"</td><td>"+val.snp2geneTitle
					+"</td><td>"+val.created_at+"</td><td>"+val.status
					+'</td><td style="text-align: center;"><input type="checkbox" class="deleteJobCheck" value="'
					+val.jobID+'"/></td></tr>';
			});
		}

		// Put list in table
		$('#joblist table tbody')
			.empty()
			.append(items);
	});
}
