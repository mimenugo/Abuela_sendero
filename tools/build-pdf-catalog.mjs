import { readFile, writeFile } from "node:fs/promises";

const base = JSON.parse(await readFile(new URL("../products.json", import.meta.url), "utf8"))
  .filter(product => Number(product.id) <= 12);

const items = [];
const add = (name, category, price, description, emoji = "🥤") => {
  items.push({ name, category, price, emoji, image: "", description, active: true });
};

add("La María", "Coctelería", 129, "Guanábana, infusión cítrica, cereza y agua mineral.", "🍹");
add("Místico", "Coctelería", 129, "Maracuyá, menta, infusión cítrica, jarabe natural y agua mineral.", "🍹");
add("Xolo", "Coctelería", 129, "Frutos rojos, mezcla de cítricos y agua tónica.", "🍹");
add("Jaguar", "Coctelería", 129, "Durazno, menta, mango, cítricos y agua tónica.", "🍹");
add("Alebrije", "Coctelería", 129, "Kiwi, limón amarillo, toque secreto de la abuela y agua mineral.", "🍹");
add("Bajío", "Coctelería", 129, "Fresa, kiwi, naranja, limón verde y azúcar morena.", "🍹");
add("Mojito Virgen", "Coctelería", 129, "Limón, menta, jarabe y agua mineral. Sabores: limón, maracuyá, frutos rojos, kiwi, tamarindo, mango, fresa o durazno.", "🍹");
add("Jarra grande de mocktel", "Coctelería", 280, "Jarra grande de mocktel para compartir.", "🍹");

add("Mateo Martini", "Mixología", 139, "Jack Daniel's, Amaretto Disaronno, maracuyá y cítricos.", "🍸");
add("Catrina", "Mixología", 139, "Mezcal, licor de naranja, jamaica, maracuyá y agua quina.", "🍸");
add("Margarita Mexicana", "Mixología", 139, "Tequila blanco, Controy, guanábana, naranja y chile serrano. Frozen.", "🍸");
add("Frontera", "Mixología", 139, "Vodka de tamarindo, mango, limón, azúcar morena, agua mineral y tónica.", "🍸");
add("Diegos", "Mixología", 139, "Ginebra, manzana verde, kiwi, azúcar mascabado, limón amarillo y agua mineral.", "🍸");
add("El Santo", "Mixología", 139, "Vodka, Hypnotiq, durazno, manzana y agua tónica.", "🍸");
add("Nahual Rojo", "Mixología", 139, "Mezcal, Licor 43, frutos rojos, naranja y escarchado de tamarindo y Tajín.", "🍸");
add("Martini Azteca", "Mixología", 139, "Ron Malibu, Licor 43, guanábana, maracuyá, naranja y jarabe. Frapeado.", "🍸");
add("Bebida de la Frida", "Mixología", 139, "Tequila reposado, licor de naranja, albahaca, cítricos y escarchado de tamarindo y Tajín.", "🍸");
add("Chente", "Mixología", 139, "Tequila, Controy, mango, limón, jarabe y chile serrano. Frapeado.", "🍸");
add("Carajillo de Olla", "Mixología", 139, "Café de olla caliente con Licor 43 o mezcal.", "☕");

[
  ["Aguas del día",55],["Jugo de naranja",69],["Jugo verde",70],["Soda",45],
  ["Café de olla",59],["Café americano",55],["Café lechero",80],
  ["Tisana de sabores",79],["Chocolate caliente",65],["Avena en vaso",55],
  ["Botella de agua",30],["Jarra de agua del día",169],["Jarra de jugo de naranja",190],
  ["Limonada natural",60],["Limonada mineral",65],["Jarra de limonada natural",179],
  ["Jarra de limonada mineral",189],["Naranjada natural",65],["Naranjada mineral",69],
  ["Jarra de naranjada natural",179],["Jarra de naranjada mineral",189],
  ["Licuado de plátano",65],["Licuado de fresa",69],["Choco milk",55],
  ["Malteada de fresa",79],["Malteada de vainilla",79],["Malteada de chocolate",79],
  ["Malteada de Oreo",79]
].forEach(([name, price]) => add(name, "Bebidas", price, "Bebida preparada al momento."));

add("Carajillo", "Bebidas clásicas", 139, "Licor 43 y espresso.", "🍸");
add("Martini Espresso", "Bebidas clásicas", 139, "Vodka, espresso, jarabe y Baileys.", "🍸");
add("Martini Cosmopolitan", "Bebidas clásicas", 139, "Vodka, cítricos y arándanos.", "🍸");
add("Old Fashioned", "Bebidas clásicas", 139, "Whisky, licor de angostura y naranja.", "🥃");
add("Sangría de la Casa", "Bebidas clásicas", 139, "Limón amarillo, jarabe, agua mineral y vino rosado, blanco o tinto.", "🍷");
add("Mojito Cubano", "Bebidas clásicas", 139, "Ron, hierbabuena, limón amarillo, jarabe y agua mineral. Varios sabores.", "🍹");
add("Margarita en Rocas o Frozen", "Bebidas clásicas", 139, "Tequila, licor de naranja, limón, jarabe y escarchado de tamarindo y Tajín.", "🍹");
add("Mezcalita en Rocas o Frozen", "Bebidas clásicas", 139, "Mezcal, licor de naranja, limón, jarabe y escarchado de tamarindo y Tajín.", "🍹");
add("Piña Colada Clásica", "Bebidas clásicas", 139, "Ron, crema de coco, piña y Carnation.", "🍹");
add("Mimosa TJ", "Bebidas clásicas", 129, "Vino espumoso con mezclador natural de naranja, maracuyá, durazno, kiwi o frutos rojos.", "🥂");
add("Jarra de Sangría de la Casa", "Bebidas clásicas", 289, "Limón, jarabe, agua mineral y vino rosado, blanco o tinto.", "🍷");
add("Daiquiri", "Bebidas clásicas", 139, "Ron, limón y jarabe. Varios sabores.", "🍹");
add("Gin-Tonic", "Bebidas clásicas", 139, "Ginebra y agua tónica. Varios sabores.", "🍸");
add("Bloody Mary", "Bebidas clásicas", 139, "Vodka, jugo de tomate, limón, Tabasco y escarchado con Tajín y tamarindo.", "🍸");
add("Paloma", "Bebidas clásicas", 139, "Tequila reposado, limón, toronja y jarabe natural.", "🍹");

[
  ["Don Julio Blanco",109],["Don Julio Reposado",119],["Don Julio 70",159],
  ["Maestro Dobel Cristalino Diamante",149],["Tequila Don Ramón Blanco",139],
  ["Tequila Don Ramón Reposado",139],["Tequila Tradicional Reposado",109],
  ["Tequila Centenario Reposado",109],["Tequila Eterno Blanco",109],["Tequila 1800 Añejo",139]
].forEach(([name, price]) => add(name, "Tequila", price, "Copa de tequila.", "🥃"));

add("Bombay", "Ginebra", 139, "Copa de ginebra.", "🥃");

[
  ["Etiqueta Roja",129],["Etiqueta Negra",149],["Etiqueta Doble Negra",169],
  ["Buchanan's 12",149],["Buchanan's 18",169],["Buchanan's Master",189],
  ["Buchanan's Pineapple",149],["Chivas Regal 12",149]
].forEach(([name, price]) => add(name, "Whisky", price, "Copa de whisky.", "🥃"));

add("Absolut Azul", "Vodka", 129, "Copa de vodka.", "🥃");
[
  ["Malibu",119],["Captain Morgan Spiced",119],["Bacardí Blanco",119]
].forEach(([name, price]) => add(name, "Ron", price, "Copa de ron.", "🥃"));
add("400 Conejos Joven", "Mezcal", 129, "Copa de mezcal.", "🥃");
[
  ["Hypnotiq",119],["Licor 43",109],["Amaretto Disaronno",109]
].forEach(([name, price]) => add(name, "Licores", price, "Licor por copeo.", "🥃"));
add("Cabernet Sauvignon", "Vino tinto", 109, "Copa de vino tinto.", "🍷");
add("Zinfandel", "Vino rosado", 109, "Copa de vino rosado.", "🍷");
add("Chardonnay", "Vino blanco", 109, "Copa de vino blanco.", "🍷");
add("Chambrule", "Vino espumoso", 109, "Copa de vino espumoso.", "🥂");

const startId = Math.max(...base.map(product => Number(product.id))) + 1;
const startOrder = Math.max(...base.map(product => Number(product.order) || 0)) + 1;
const imported = items.map((product, index) => ({
  id: startId + index,
  ...product,
  order: startOrder + index
}));
const catalog = [...base, ...imported];

await writeFile(
  new URL("../products.json", import.meta.url),
  `${JSON.stringify(catalog, null, 2)}\n`,
  "utf8"
);
await writeFile(
  new URL("../catalog-backup.js", import.meta.url),
  `window.CHANA_CATALOG_BACKUP = ${JSON.stringify(catalog, null, 2)};\n`,
  "utf8"
);

console.log(`Catálogo actualizado: ${base.length} existentes + ${imported.length} del PDF = ${catalog.length}.`);
