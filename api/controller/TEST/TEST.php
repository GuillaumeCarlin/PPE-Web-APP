<?php


if (isset(getallheaders()['Authorization'])) {
    echo getallheaders()['Authorization'];
}else{
    echo 'Pas d\'auto';
}

//$Token = getallheaders()['Authorization'];
$Format = explode('/', getallheaders()['Accept'])[1];

var_dump($Format);

//http://localhost/Thot/api/V1/odf/150710/bilanproduction
//http://localhost/Thot/api/V1/rsc/Fv_4/nbcycle?date=20200502