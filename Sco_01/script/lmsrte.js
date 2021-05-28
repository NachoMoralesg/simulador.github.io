// Documento Javascript

_debug=false;

////////////////////////////////////////////////////////////////////////////////////////////



///////////////////////////////////////////////////////////////////////////////////////////
//     Clase ScoRte.
//     Esta clase nos permite crear objetos capaces de comunicarse con el LMS.
//     SCORM 1.2.
//
///////////////////////////////////////////////////////////////////////////////////////////

function ScoRte(){

                  
                 this.api = window.opener.TheAPI;
                 this.errorCode = 0;
				 this.continueEstatus=null;
				 this.movie=null;
}

/*****************************************************************************************/
ScoRte.prototype.getErrorCode = function(){
                
				this.errorCode = this.api.LMSGetLastError();
                return parseInt( this.errorCode );
}
/*****************************************************************************************/
ScoRte.prototype.printError = function( mensaje,num ) {
               
			   alert( mensaje + " " + this.api.LMSGetErrorString(num) );
}
/*****************************************************************************************/
ScoRte.prototype.getEstadoDeSesion = function(){

              return window.opener.estadoDeSesion;
}
/*****************************************************************************************/
ScoRte.prototype.setEstadoDeSesion = function( val ){

             window.opener.estadoDeSesion = val;
}

/*****************************************************************************************/
ScoRte.prototype.setMovie = function( mov ){
           
             this.movie=mov;
			 
}

/*****************************************************************************************/
ScoRte.prototype.movieNull = function( ){
           
             this.movie.GotoFrame(0);
			 
}
/*****************************************************************************************/

ScoRte.prototype.iniciar = function(){

        this.continueEstatus = this.api.LMSInitialize("");
		
		if(this.continueEstatus){
		       
			   
			    if( eNum = this.getErrorCode() ){
                     
					                            this.printError( "LMSInitialize() se encuentra activo\r\rError : " + eNum , eNum );
                } else {
   
                                               if( _debug ){
											    
												alert( "LMSInitialize()..." );
												
												}
												
												this.setEstadoDeSesion( true );
											
			                                    
		                 }
		
		
		}else{
		
		alert( "adaptador API no definido, por favor vuelva a reiniciar." );
		
		 
		}
		
		

}

/*****************************************************************************************/

ScoRte.prototype.finalizar=function(){

      this.continueEstatus=this.api.LMSFinish("");

      if( this.continueEstatus ) {
 
                             if( eNum = this.getErrorCode() ){
                     
					                            this.printError( "LMSFinish() no se ejecutó con exito\r\rError : " + eNum , eNum );
                             }else{
                      
					                     if( _debug ){
                                               
											    alert( "LMSFinish()..." );
					                     }
					          
							              this.setEstadoDeSesion(null);
                            }
 
 
      } else {
 
          alert("adaptador API no definido, por favor vuelva a reiniciar.");
		
	 }
}

/*****************************************************************************************/
ScoRte.prototype.guardar=function(){

         this.continueEstatus=this.api.LMSCommit("");
		 
		 if( this.continueEstatus ) {
		 
		                        if( eNum = this.getErrorCode() ){
                     
					                            this.printError( "LMSCommit() no se ejecutó con exito\r\rError : " + eNum , eNum );
												return false;
                                }else{
                      
					                     if( _debug ){
                                               
											    alert( "LMSCommit()..." );
					                     }
					          
							             return true;
                                }
		        
		 
		 
		 
		 }else{
		 
		 
            alert("adaptador API no definido, por favor vuelva a reiniciar.");
	    }


}


/*****************************************************************************************/

ScoRte.prototype.guardarYfinalizar=function(){

         this.continueEstatus=this.guardar();
		 
		 if( this.continueEstatus ) {
		 
		                  this.finalizar();    
		        
		 
		 }else{
		 
		 
            alert("Los datos no se guardaron correctamente.");
	    }


}

/*****************************************************************************************/
ScoRte.prototype.getValue=function(modelo){
         
         this.continueEstatus=this.api.LMSGetValue(modelo);
		 
		                        if( eNum = this.getErrorCode() ){
                     
					                            this.printError( "LMSGetValue() no se ejecutó con exito\r\rError : " + eNum , eNum );
												this.movieNull();
											
                                }else{
                      
					                     if( _debug ){
                                               
											    alert( "LMSGetValue("+modelo+")" );
												
					                     }
										 
										 this.movie.setVariable("datoActual",this.continueEstatus);
							             
                                }


}

/*****************************************************************************************/
ScoRte.prototype.setValue=function(modelo,valor){
     
         this.continueEstatus=this.api.LMSSetValue(modelo,valor);
		 
		                        if( eNum = this.getErrorCode() ){
                     
					                            this.printError( "LMSSetValue() no se ejecutó con exito\r\rError : " + eNum , eNum );
												this.movieNull();
											
                                }else{
                      
					                     if( _debug ){
                                               
											    alert( "LMSSetValue("+modelo+","+valor+")" );
												
					                     }
										 
										 
							             
                                }


}
///////////////////////////////////////////////////////////////////////////////////////////
//
//  miSesion = new ScoRte();
//  Creamos el objeto "miSesion", este objeto ahora es capaz de comunicarse con el LMS.
//
///////////////////////////////////////////////////////////////////////////////////////////

if( _debug ){
              
			  alert("Creando la instancia de ScoRte");
}

miSesion = new ScoRte(); //objeto miSesion

if( miSesion.getEstadoDeSesion() ){

            alert("Su sesión está siendo actualizada.");
            miSesion.guardarYfinalizar();

}


///////////////////////////////////////////////////////////////////////////////////////////
//
//  mySco_DoFSCommand();
//  Por medio de esta función recibimos los parámetros enviados por el swf.
//
//
///////////////////////////////////////////////////////////////////////////////////////////

function mySco_DoFSCommand(comando,valores){

switch(comando){

    case "LMSInitialize":
	
	                miSesion.iniciar();
					break;
	case "LMSFinish":
	                miSesion.finalizar();
					break;
					
	case "LMSCommit":
	
	               miSesion.guardar();
				   break;
				   
	case "LMSGetValue":
	        
			       
				   miSesion.getValue(valores);
				   break;
				   
	case "LMSSetValue":
	        
			       
				  if(valores.indexOf(",")==-1){
				  alert("fscommand(\"LMSSetValue\",\"modelo,valor\") mal formado.");
				  miSesion.movieNull();
				  break;
				  }
				   var modAndVal=valores.split(",");
				   miSesion.setValue(modAndVal[0],modAndVal[1]);
				   break;
	case "Salir":
	              if ( confirm( "¿Seguro que desea abandonar este objeto de aprendizaje?" ) ) {
				   
				   miSesion.guardarYfinalizar();
				   window.close();
				   } else {
				   
				  // alert("");
				   }
     	
		
					
	}




}





