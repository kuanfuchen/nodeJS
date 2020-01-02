 const convertPage = function (resource, currentPage) {
     const totalResult = resource.length; //資料總數量
     const perpage = 3; //每頁3筆資料
     const totalPage = Math.ceil(totalResult / perpage); //全部頁數
     // let currentPage = 3;
     if (currentPage > totalPage) {
         currentPage = totalPage
     };
     const minItem = (currentPage * perpage) - perpage + 1;
     const maxItem = (currentPage * perpage);
     console.log('該頁數的最小資料數', minItem, '該頁數的最大資料數', maxItem, '全部頁數', totalPage)
     const data = [];
     resource.forEach(function (item, i) {
         let itemNum = i + 1;
         if (itemNum >= minItem && itemNum <= maxItem) {
             data.push(item);
         }
     });
     let page = {
         totalPage,
         currentPage,
         hasPre: currentPage > 1,
         hasNet: currentPage < totalPage
     };
     return {
         data,
         page
     }
 };

 module.exports = convertPage;