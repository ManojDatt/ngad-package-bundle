/**
 * @license
 * Copyright Google LLC All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://angular.io/license
 */
// THIS CODE IS GENERATED - DO NOT MODIFY.
const u = undefined;
function plural(val) {
    const n = val, i = Math.floor(Math.abs(val)), v = val.toString().replace(/^[^.]*\.?/, '').length;
    if (i === 1 && v === 0)
        return 1;
    if (i === 2 && v === 0)
        return 2;
    if (v === 0 && (!(n >= 0 && n <= 10) && n % 10 === 0))
        return 4;
    return 5;
}
export default ["he", [["לפנה״צ", "אחה״צ"], u, u], [["לפנה״צ", "אחה״צ"], ["AM", "PM"], u], [["א׳", "ב׳", "ג׳", "ד׳", "ה׳", "ו׳", "ש׳"], ["יום א׳", "יום ב׳", "יום ג׳", "יום ד׳", "יום ה׳", "יום ו׳", "שבת"], ["יום ראשון", "יום שני", "יום שלישי", "יום רביעי", "יום חמישי", "יום שישי", "יום שבת"], ["א׳", "ב׳", "ג׳", "ד׳", "ה׳", "ו׳", "ש׳"]], u, [["1", "2", "3", "4", "5", "6", "7", "8", "9", "10", "11", "12"], ["ינו׳", "פבר׳", "מרץ", "אפר׳", "מאי", "יוני", "יולי", "אוג׳", "ספט׳", "אוק׳", "נוב׳", "דצמ׳"], ["ינואר", "פברואר", "מרץ", "אפריל", "מאי", "יוני", "יולי", "אוגוסט", "ספטמבר", "אוקטובר", "נובמבר", "דצמבר"]], u, [["לפני", "אחריי"], ["לפנה״ס", "לספירה"], ["לפני הספירה", "לספירה"]], 0, [5, 6], ["d.M.y", "d בMMM y", "d בMMMM y", "EEEE, d בMMMM y"], ["H:mm", "H:mm:ss", "H:mm:ss z", "H:mm:ss zzzz"], ["{1}, {0}", u, "{1} בשעה {0}", u], [".", ",", ";", "%", "‎+", "‎-", "E", "×", "‰", "∞", "NaN", ":"], ["#,##0.###", "#,##0%", "‏#,##0.00 ¤;‏-#,##0.00 ¤", "#E0"], "ILS", "₪", "שקל חדש", { "BYN": [u, "р"], "CNY": ["‎CN¥‎", "¥"], "ILP": ["ל״י"], "PHP": [u, "₱"], "THB": ["฿"], "TWD": ["NT$"] }, "rtl", plural];
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiaGUuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi8uLi8uLi8uLi8uLi9wYWNrYWdlcy9jb21tb24vbG9jYWxlcy9oZS50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQTs7Ozs7O0dBTUc7QUFFSCwwQ0FBMEM7QUFDMUMsTUFBTSxDQUFDLEdBQUcsU0FBUyxDQUFDO0FBRXBCLFNBQVMsTUFBTSxDQUFDLEdBQVc7SUFDM0IsTUFBTSxDQUFDLEdBQUcsR0FBRyxFQUFFLENBQUMsR0FBRyxJQUFJLENBQUMsS0FBSyxDQUFDLElBQUksQ0FBQyxHQUFHLENBQUMsR0FBRyxDQUFDLENBQUMsRUFBRSxDQUFDLEdBQUcsR0FBRyxDQUFDLFFBQVEsRUFBRSxDQUFDLE9BQU8sQ0FBQyxXQUFXLEVBQUUsRUFBRSxDQUFDLENBQUMsTUFBTSxDQUFDO0lBRWpHLElBQUksQ0FBQyxLQUFLLENBQUMsSUFBSSxDQUFDLEtBQUssQ0FBQztRQUNsQixPQUFPLENBQUMsQ0FBQztJQUNiLElBQUksQ0FBQyxLQUFLLENBQUMsSUFBSSxDQUFDLEtBQUssQ0FBQztRQUNsQixPQUFPLENBQUMsQ0FBQztJQUNiLElBQUksQ0FBQyxLQUFLLENBQUMsSUFBSSxDQUFDLENBQUMsQ0FBQyxDQUFDLElBQUksQ0FBQyxJQUFJLENBQUMsSUFBSSxFQUFFLENBQUMsSUFBSSxDQUFDLEdBQUcsRUFBRSxLQUFLLENBQUMsQ0FBQztRQUNqRCxPQUFPLENBQUMsQ0FBQztJQUNiLE9BQU8sQ0FBQyxDQUFDO0FBQ1QsQ0FBQztBQUVELGVBQWUsQ0FBQyxJQUFJLEVBQUMsQ0FBQyxDQUFDLFFBQVEsRUFBQyxPQUFPLENBQUMsRUFBQyxDQUFDLEVBQUMsQ0FBQyxDQUFDLEVBQUMsQ0FBQyxDQUFDLFFBQVEsRUFBQyxPQUFPLENBQUMsRUFBQyxDQUFDLElBQUksRUFBQyxJQUFJLENBQUMsRUFBQyxDQUFDLENBQUMsRUFBQyxDQUFDLENBQUMsSUFBSSxFQUFDLElBQUksRUFBQyxJQUFJLEVBQUMsSUFBSSxFQUFDLElBQUksRUFBQyxJQUFJLEVBQUMsSUFBSSxDQUFDLEVBQUMsQ0FBQyxRQUFRLEVBQUMsUUFBUSxFQUFDLFFBQVEsRUFBQyxRQUFRLEVBQUMsUUFBUSxFQUFDLFFBQVEsRUFBQyxLQUFLLENBQUMsRUFBQyxDQUFDLFdBQVcsRUFBQyxTQUFTLEVBQUMsV0FBVyxFQUFDLFdBQVcsRUFBQyxXQUFXLEVBQUMsVUFBVSxFQUFDLFNBQVMsQ0FBQyxFQUFDLENBQUMsSUFBSSxFQUFDLElBQUksRUFBQyxJQUFJLEVBQUMsSUFBSSxFQUFDLElBQUksRUFBQyxJQUFJLEVBQUMsSUFBSSxDQUFDLENBQUMsRUFBQyxDQUFDLEVBQUMsQ0FBQyxDQUFDLEdBQUcsRUFBQyxHQUFHLEVBQUMsR0FBRyxFQUFDLEdBQUcsRUFBQyxHQUFHLEVBQUMsR0FBRyxFQUFDLEdBQUcsRUFBQyxHQUFHLEVBQUMsR0FBRyxFQUFDLElBQUksRUFBQyxJQUFJLEVBQUMsSUFBSSxDQUFDLEVBQUMsQ0FBQyxNQUFNLEVBQUMsTUFBTSxFQUFDLEtBQUssRUFBQyxNQUFNLEVBQUMsS0FBSyxFQUFDLE1BQU0sRUFBQyxNQUFNLEVBQUMsTUFBTSxFQUFDLE1BQU0sRUFBQyxNQUFNLEVBQUMsTUFBTSxFQUFDLE1BQU0sQ0FBQyxFQUFDLENBQUMsT0FBTyxFQUFDLFFBQVEsRUFBQyxLQUFLLEVBQUMsT0FBTyxFQUFDLEtBQUssRUFBQyxNQUFNLEVBQUMsTUFBTSxFQUFDLFFBQVEsRUFBQyxRQUFRLEVBQUMsU0FBUyxFQUFDLFFBQVEsRUFBQyxPQUFPLENBQUMsQ0FBQyxFQUFDLENBQUMsRUFBQyxDQUFDLENBQUMsTUFBTSxFQUFDLE9BQU8sQ0FBQyxFQUFDLENBQUMsUUFBUSxFQUFDLFFBQVEsQ0FBQyxFQUFDLENBQUMsYUFBYSxFQUFDLFFBQVEsQ0FBQyxDQUFDLEVBQUMsQ0FBQyxFQUFDLENBQUMsQ0FBQyxFQUFDLENBQUMsQ0FBQyxFQUFDLENBQUMsT0FBTyxFQUFDLFVBQVUsRUFBQyxXQUFXLEVBQUMsaUJBQWlCLENBQUMsRUFBQyxDQUFDLE1BQU0sRUFBQyxTQUFTLEVBQUMsV0FBVyxFQUFDLGNBQWMsQ0FBQyxFQUFDLENBQUMsVUFBVSxFQUFDLENBQUMsRUFBQyxjQUFjLEVBQUMsQ0FBQyxDQUFDLEVBQUMsQ0FBQyxHQUFHLEVBQUMsR0FBRyxFQUFDLEdBQUcsRUFBQyxHQUFHLEVBQUMsSUFBSSxFQUFDLElBQUksRUFBQyxHQUFHLEVBQUMsR0FBRyxFQUFDLEdBQUcsRUFBQyxHQUFHLEVBQUMsS0FBSyxFQUFDLEdBQUcsQ0FBQyxFQUFDLENBQUMsV0FBVyxFQUFDLFFBQVEsRUFBQywwQkFBMEIsRUFBQyxLQUFLLENBQUMsRUFBQyxLQUFLLEVBQUMsR0FBRyxFQUFDLFNBQVMsRUFBQyxFQUFDLEtBQUssRUFBQyxDQUFDLENBQUMsRUFBQyxHQUFHLENBQUMsRUFBQyxLQUFLLEVBQUMsQ0FBQyxPQUFPLEVBQUMsR0FBRyxDQUFDLEVBQUMsS0FBSyxFQUFDLENBQUMsS0FBSyxDQUFDLEVBQUMsS0FBSyxFQUFDLENBQUMsQ0FBQyxFQUFDLEdBQUcsQ0FBQyxFQUFDLEtBQUssRUFBQyxDQUFDLEdBQUcsQ0FBQyxFQUFDLEtBQUssRUFBQyxDQUFDLEtBQUssQ0FBQyxFQUFDLEVBQUMsS0FBSyxFQUFFLE1BQU0sQ0FBQyxDQUFDIiwic291cmNlc0NvbnRlbnQiOlsiLyoqXG4gKiBAbGljZW5zZVxuICogQ29weXJpZ2h0IEdvb2dsZSBMTEMgQWxsIFJpZ2h0cyBSZXNlcnZlZC5cbiAqXG4gKiBVc2Ugb2YgdGhpcyBzb3VyY2UgY29kZSBpcyBnb3Zlcm5lZCBieSBhbiBNSVQtc3R5bGUgbGljZW5zZSB0aGF0IGNhbiBiZVxuICogZm91bmQgaW4gdGhlIExJQ0VOU0UgZmlsZSBhdCBodHRwczovL2FuZ3VsYXIuaW8vbGljZW5zZVxuICovXG5cbi8vIFRISVMgQ09ERSBJUyBHRU5FUkFURUQgLSBETyBOT1QgTU9ESUZZLlxuY29uc3QgdSA9IHVuZGVmaW5lZDtcblxuZnVuY3Rpb24gcGx1cmFsKHZhbDogbnVtYmVyKTogbnVtYmVyIHtcbmNvbnN0IG4gPSB2YWwsIGkgPSBNYXRoLmZsb29yKE1hdGguYWJzKHZhbCkpLCB2ID0gdmFsLnRvU3RyaW5nKCkucmVwbGFjZSgvXlteLl0qXFwuPy8sICcnKS5sZW5ndGg7XG5cbmlmIChpID09PSAxICYmIHYgPT09IDApXG4gICAgcmV0dXJuIDE7XG5pZiAoaSA9PT0gMiAmJiB2ID09PSAwKVxuICAgIHJldHVybiAyO1xuaWYgKHYgPT09IDAgJiYgKCEobiA+PSAwICYmIG4gPD0gMTApICYmIG4gJSAxMCA9PT0gMCkpXG4gICAgcmV0dXJuIDQ7XG5yZXR1cm4gNTtcbn1cblxuZXhwb3J0IGRlZmF1bHQgW1wiaGVcIixbW1wi15zXpNeg15TXtNemXCIsXCLXkNeX15TXtNemXCJdLHUsdV0sW1tcItec16TXoNeU17TXplwiLFwi15DXl9eU17TXplwiXSxbXCJBTVwiLFwiUE1cIl0sdV0sW1tcIteQ17NcIixcIteR17NcIixcIteS17NcIixcIteT17NcIixcIteU17NcIixcIteV17NcIixcItep17NcIl0sW1wi15nXldedINeQ17NcIixcIteZ15XXnSDXkdezXCIsXCLXmdeV150g15LXs1wiLFwi15nXldedINeT17NcIixcIteZ15XXnSDXlNezXCIsXCLXmdeV150g15XXs1wiLFwi16nXkdeqXCJdLFtcIteZ15XXnSDXqNeQ16nXldefXCIsXCLXmdeV150g16nXoNeZXCIsXCLXmdeV150g16nXnNeZ16nXmVwiLFwi15nXldedINeo15HXmdei15lcIixcIteZ15XXnSDXl9ee15nXqdeZXCIsXCLXmdeV150g16nXmdep15lcIixcIteZ15XXnSDXqdeR16pcIl0sW1wi15DXs1wiLFwi15HXs1wiLFwi15LXs1wiLFwi15PXs1wiLFwi15TXs1wiLFwi15XXs1wiLFwi16nXs1wiXV0sdSxbW1wiMVwiLFwiMlwiLFwiM1wiLFwiNFwiLFwiNVwiLFwiNlwiLFwiN1wiLFwiOFwiLFwiOVwiLFwiMTBcIixcIjExXCIsXCIxMlwiXSxbXCLXmdeg15XXs1wiLFwi16TXkdeo17NcIixcItee16jXpVwiLFwi15DXpNeo17NcIixcItee15DXmVwiLFwi15nXldeg15lcIixcIteZ15XXnNeZXCIsXCLXkNeV15LXs1wiLFwi16HXpNeY17NcIixcIteQ15XXp9ezXCIsXCLXoNeV15HXs1wiLFwi15PXptee17NcIl0sW1wi15nXoNeV15DXqFwiLFwi16TXkdeo15XXkNeoXCIsXCLXnteo16VcIixcIteQ16TXqNeZ15xcIixcItee15DXmVwiLFwi15nXldeg15lcIixcIteZ15XXnNeZXCIsXCLXkNeV15LXldeh15hcIixcIteh16TXmNee15HXqFwiLFwi15DXlden15jXldeR16hcIixcIteg15XXkdee15HXqFwiLFwi15PXptee15HXqFwiXV0sdSxbW1wi15zXpNeg15lcIixcIteQ15fXqNeZ15lcIl0sW1wi15zXpNeg15TXtNehXCIsXCLXnNeh16TXmdeo15RcIl0sW1wi15zXpNeg15kg15TXodek15nXqNeUXCIsXCLXnNeh16TXmdeo15RcIl1dLDAsWzUsNl0sW1wiZC5NLnlcIixcImQg15FNTU0geVwiLFwiZCDXkU1NTU0geVwiLFwiRUVFRSwgZCDXkU1NTU0geVwiXSxbXCJIOm1tXCIsXCJIOm1tOnNzXCIsXCJIOm1tOnNzIHpcIixcIkg6bW06c3Mgenp6elwiXSxbXCJ7MX0sIHswfVwiLHUsXCJ7MX0g15HXqdei15QgezB9XCIsdV0sW1wiLlwiLFwiLFwiLFwiO1wiLFwiJVwiLFwi4oCOK1wiLFwi4oCOLVwiLFwiRVwiLFwiw5dcIixcIuKAsFwiLFwi4oieXCIsXCJOYU5cIixcIjpcIl0sW1wiIywjIzAuIyMjXCIsXCIjLCMjMCVcIixcIuKAjyMsIyMwLjAwwqDCpDvigI8tIywjIzAuMDDCoMKkXCIsXCIjRTBcIl0sXCJJTFNcIixcIuKCqlwiLFwi16nXp9ecINeX15PXqVwiLHtcIkJZTlwiOlt1LFwi0YBcIl0sXCJDTllcIjpbXCLigI5DTsKl4oCOXCIsXCLCpVwiXSxcIklMUFwiOltcItec17TXmVwiXSxcIlBIUFwiOlt1LFwi4oKxXCJdLFwiVEhCXCI6W1wi4Li/XCJdLFwiVFdEXCI6W1wiTlQkXCJdfSxcInJ0bFwiLCBwbHVyYWxdO1xuIl19