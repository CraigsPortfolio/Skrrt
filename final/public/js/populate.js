function populate(){
  var ddlItems = document.getElementById("dropgarage");
    var  itemArray = <%= options %>;

      for (var i = 0; i < itemArray.length; i++) {
        var opt = itemArray[i];
        var el = document.createElement("option");
        el.textContent = opt.reg;
        el.value = opt.reg;
        ddlItems.appendChild(el);
      }
}
