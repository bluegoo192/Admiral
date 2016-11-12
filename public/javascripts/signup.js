$(document).ready(function()
{
  
  alert('Hi');

  $("#userbtn").click(function(e) {
      // Prevent a page reload when a link is pressed
      e.preventDefault();
      // Toggle active classes
      document.getElementById("userbtn").classList.add('active');
      document.getElementById("sitebtn").classList.remove('active');
      document.getElementById("adbtn").classList.remove('active');
      // $('#userbtn').addClass("active");
      // $('#sitebtn').removeClass("active");
      // $('#adbtn').removeClass("active");
    }
  });

  $("#sitebtn").click(function(e) {
      // Prevent a page reload when a link is pressed
      e.preventDefault();
      // Toggle active classes
      document.getElementById("userbtn").classList.remove('active');
      document.getElementById("sitebtn").classList.add('active');
      document.getElementById("adbtn").classList.remove('active');
      // $('#userbtn').removeClass("active");
      // $('#sitebtn').addClass("active");
      // $('#adbtn').removeClass("active");
    }
  });

  $("#userbtn").click(function(e) {
      // Prevent a page reload when a link is pressed
      e.preventDefault();
      // Toggle active classes
      document.getElementById("userbtn").classList.remove('active');
      document.getElementById("sitebtn").classList.remove('active');
      document.getElementById("adbtn").classList.add('active');
      // $('#userbtn').removeClass("active");
      // $('#sitebtn').removeClass("active");
      // $('#adbtn').addClass("active");
    }
  });


});
