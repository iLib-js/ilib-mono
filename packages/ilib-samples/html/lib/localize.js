/*
 * localize.js - ilib usage
 *
 * Copyright © 2022 JEDLSoft
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *     http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 *
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

var rb = new ResBundle({locale: "ko-KR"});
var str_ko = rb.getString("hello");
var jsStr_ko = str_ko.toString(); 

var rb = new ResBundle({locale: "es-ES"});
var str_es = rb.getString("hello");
var jsStr_es = str_es.toString(); 

var rb = new ResBundle({locale: "zxx-XX"});
var str_xx = rb.getString("hello");
var jsStr_xx = str_xx.toString();

var date = new Date();
var fmt = new DateFmt({type: "datetime", locale:"ko-KR", length: "full", timezone: "local"})
var dateString = fmt.format(date);

var fmt = new DateFmt({type: "datetime", locale:"es-ES", length: "full", timezone: "local"})
var dateString2 = fmt.format(date);