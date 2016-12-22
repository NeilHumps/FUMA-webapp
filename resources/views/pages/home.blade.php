@extends('layouts.master')
@section('head')
<script src="//ajax.googleapis.com/ajax/libs/jquery/1.12.4/jquery.min.js"></script>
<script src="//maxcdn.bootstrapcdn.com/bootstrap/3.3.7/js/bootstrap.min.js"></script>

@stop
@section('content')
<div class="container" style="padding-top:50px;">
  <div style="text-align: center;">
    <h2>FUMA GWAS</h2>
    <h2>Functional Mapping and Annotation of genome-wide association results</h2>
  </div>
  <br/>
  <p>FUMA is a platform that can be used to annotate, prioritize and visualize and interpret GWAS results.
  <br/>
    The <a href="{{ Config::get('app.subdir') }}/snp2gene">SNP2GENE</a> function takes GWAS summary statistics or a list of rsid’s as input,
    and provides extensive functional annotation for all SNPs in genomic areas identified by lead SNPs.
    <br/>
    The <a href="{{ Config::get('app.subdir') }}/gene2func">GENE2FUNC</a> function takes a list of geneids (as identified by SNP2GENE or as provided manually)
    and annotates genes in biological context
    <br/>
    Please log in to use FUMA.
    If you have't registered yet, you can do from <a href="{{ url('/register') }}">here</a>.
    <br/>
    When using FUMA, please acknowledge Watanabe et al. xxx
  </p>

</div>
</br>
@stop
