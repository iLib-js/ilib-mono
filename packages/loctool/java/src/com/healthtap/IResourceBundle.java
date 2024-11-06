/**
 * Copyright © 2016-2017, HealthTap, Inc.
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
package com.healthtap;

import java.lang.reflect.Field;
import java.util.Collections;
import java.util.Enumeration;
import java.util.HashSet;
import java.util.LinkedHashMap;
import java.util.Locale;
import java.util.Map;
import java.util.regex.*;

/**
 * A class that represents a resource bundle for Android with methods 
 * that can look up
 * translated strings by the source string or by unique key. The Java
 * ResourceBundle class does not offer those methods and is not subclassable
 * because many of its methods are final. So, this class is a wrapper 
 * around ResourceBundle which delegates much of its functionality to 
 * ResourceBundle and adds the look-up by source string functionality.<p>
 * 
 * This class uses the built-in Android resources to get its strings
 * and as such, it is simply a wrapper around the regular resources.
 *
 * @author edwinhoogerbeets
 *
 */
public class IResourceBundle {
	public static final String HTML_TYPE 				= "html";
	public static final String XML_TYPE 				= "xml";
	public static final String RAW_TYPE 				= "raw";
	public static final String JAVA_TYPE 				= "java";
		
	protected static volatile Locale sourceLocale		= new Locale("en-US");

	protected Class R;
	private IStringProvider resources;
    protected Locale targetLocale;
    protected String name;
    protected String type;
    private Map<String, String> pseudoCharacters = null;
	protected boolean lengthen = true;
	protected MissingType missing = MissingType.SOURCE;
	protected Pattern pStart = Pattern.compile("^\\s*");
	protected Pattern pEnd = Pattern.compile("\\s*$");
	
	private String[][] pseudoCyrl = {
		{"a", "а"},
		{"b", "б"},
		{"c", "ч"},
		{"d", "д"},
		{"e", "э"},
		{"f", "ф"},
		{"g", "г"},
		{"h", "х"},
		{"i", "и"},
		{"j", "ж"},
		{"k", "к"},
		{"l", "л"},
		{"m", "м"},
		{"n", "н"},
		{"o", "о"},
		{"p", "п"},
		{"q", "ку"},
		{"r", "р"},
		{"s", "с"},
		{"t", "т"},
		{"u", "у"},
		{"v", "в"},
		{"x", "кс"},
		{"y", "я"},
		{"z", "з"},
		{"A", "А"},
		{"B", "Б"},
		{"C", "Ч"},
		{"D", "Д"},
		{"E", "Э"},
		{"F", "Ф"},
		{"G", "Г"},
		{"H", "Х"},
		{"I", "И"},
		{"J", "Ж"},
		{"K", "К"},
		{"L", "Л"},
		{"M", "М"},
		{"N", "Н"},
		{"O", "О"},
		{"P", "П"},
		{"Q", "КУ"},
		{"R", "Р"},
		{"S", "С"},
		{"T", "Т"},
		{"U", "У"},
		{"V", "В"},
		{"X", "КС"},
		{"Y", "Я"},
		{"Z", "З"}
	};
	private String[][] pseudoHans = {
		{"a", "阿"},
		{"b", "不"},
		{"c", "可"},
		{"d", "的"},
		{"e", "俄"},
		{"f", "凡"},
		{"g", "个"},
		{"h", "和"},
		{"i", "意"},
		{"j", "中"},
		{"k", "可"},
		{"l", "了"},
		{"m", "们"},
		{"n", "尼"},
		{"o", "夥"},
		{"p", "琶"},
		{"q", "氣"},
		{"r", "熱"},
		{"s", "思"},
		{"t", "推"},
		{"u", "思"},
		{"v", "於"},
		{"x", "相"},
		{"y", "謝"},
		{"z", "子"},
		{"A", "阿"},
		{"B", "不"},
		{"C", "可"},
		{"D", "的"},
		{"E", "俄"},
		{"F", "凡"},
		{"G", "个"},
		{"H", "和"},
		{"I", "意"},
		{"J", "中"},
		{"K", "可"},
		{"L", "了"},
		{"M", "们"},
		{"N", "尼"},
		{"O", "夥"},
		{"P", "琶"},
		{"Q", "氣"},
		{"R", "熱"},
		{"S", "思"},
		{"T", "推"},
		{"U", "思"},
		{"V", "於"},
		{"X", "相"},
		{"Y", "謝"},
		{"Z", "子"}	
	};
	
	private String[][] pseudoHebr = {
		{"a", "ַ"},
		{"b", "בּ"},
		{"c", "ק"},
		{"d", "ד"},
		{"e", "ֶ"},
		{"f", "פ"},
		{"g", "ג"},
		{"h", "ה"},
		{"i", "ִ"},
		{"j", "ג׳"},
		{"k", "כ"},
		{"l", "ל"},
		{"m", "מ"},
		{"n", "נ"},
		{"o", "ֹ"},
		{"p", "פ"},
		{"q", "ק"},
		{"r", "ר"},
		{"s", "ס"},
		{"t", "ט"},
		{"u", "ֻ"},
		{"v", "ב"},
		{"w", "ו"},
		{"x", "שׂק"},
		{"y", "י"},
		{"z", "ז"},
		{"A", "ַ"},
		{"B", "בּ"},
		{"C", "ק"},
		{"D", "דּ"},
		{"E", "ֶ"},
		{"F", "פ"},
		{"G", "ג"},
		{"H", "ה"},
		{"I", "ִ"},
		{"J", "ג׳"},
		{"K", "כ"},
		{"L", "ל"},
		{"M", "מ"},
		{"N", "נ"},
		{"O", "ֹ"},
		{"P", "פ"},
		{"Q", "ק"},
		{"R", "ר"},
		{"S", "ס"},
		{"T", "ט"},
		{"U", "ֻ"},
		{"V", "ב"},
		{"W", "ו"},
		{"X", "שׂק"},
		{"Y", "י"},
		{"Z", "ז"}
	};

	private String[][] pseudoLatn = {
		{"a", "à"},
		{"c", "ç"},
		{"d", "ð"},
		{"e", "ë"},
		{"g", "ğ"},
		{"h", "ĥ"},
		{"i", "í"},
		{"j", "ĵ"},
		{"k", "ķ"},
		{"l", "ľ"},
		{"n", "ñ"},
		{"o", "õ"},
		{"p", "þ"},
		{"r", "ŕ"},
		{"s", "š"},
		{"t", "ţ"},
		{"u", "ü"},
		{"w", "ŵ"},
		{"y", "ÿ"},
		{"z", "ž"},
		{"A", "Ã"},
		{"B", "ß"},
		{"C", "Ç"},
		{"D", "Ð"},
		{"E", "Ë"},
		{"G", "Ĝ"},
		{"H", "Ħ"},
		{"I", "Ï"},
		{"J", "Ĵ"},
		{"K", "ĸ"},
		{"L", "Ľ"},
		{"N", "Ň"},
		{"O", "Ø"},
		{"R", "Ŗ"},
		{"S", "Š"},
		{"T", "Ť"},
		{"U", "Ú"},
		{"W", "Ŵ"},
		{"Y", "Ŷ"},
		{"Z", "Ż"}	
	};

	/**
	 * Specifies the type of strategy to use when the translation of a source string or key is not found.
	 * 
	 * @author edwinhoogerbeets
	 */
	public enum MissingType {
		/**
		 * return source string if translation is not found.
		 */
		SOURCE,

		/**
		 * return pseudo localized string from source string if translation is not found.
		 */
		PSEUDO,

		/**
		 * return empty string if translation is not found.
		 */
		EMPTY,

		/**
		 * return a placeholder string instead.
		 */
		PLACEHOLDER
	};

	private Pattern percentPattern = Pattern.compile("%(\\d+\\$)?([\\-#\\+ 0,\\(])?(\\d+)?(\\.\\d+)?[bBhHsScCdoxXeEfgGaAtT%n]");
	
	/**
	 * Construct a new IResourceBundle and load in the Java
	 * ResourceBundle for delegation.
	 * @param R class containing the unique string id to id number mapping
	 * @param resources a string provider that is a source of string
	 * @param locale the ilib locale for this bundle, or null to use
	 * the current locale
	 */
	public IResourceBundle(Class R, IStringProvider resources, Locale locale) {
		this.R = R;
		this.resources = resources;
		this.targetLocale = locale != null ? locale : Locale.getDefault();
		
		this.type = RAW_TYPE;
		initPseudoMap();
	}

	/**
	 * Construct a new IResourceBundle and load in the Java
	 * ResourceBundle for delegation. This uses the given base name
	 * but the default locale.
	 * 
	 * @param R class containing the unique string id to id number mapping
	 * @param resources a string provider that is a source of string
	 */
	public IResourceBundle(Class R, IStringProvider resources) {
		this(R, resources, null);
	}

	/**
	 * Delegated
	 * @return an array of keys in this bundle
	 */
	public Enumeration<String> getKeys() {
		Field[] fields = R.getFields();
		HashSet<String> s = new HashSet<String>();
		for (int i = 0; i < fields.length; i++) {
			s.add(fields[i].getName());
		}
		return Collections.enumeration(s);
	}
	
    protected void initPseudoMap()
    {
    	pseudoCharacters = new LinkedHashMap<>();

    	String[][] pseudo;
    	
    	switch( ScriptInfo.getScriptByLocale(targetLocale) ) {
    		case "Cyrl":
    			pseudo = pseudoCyrl;
    			break;
    		case "Hans":
    			pseudo = pseudoHans;
    			break;
    		case "Hebr":
    			pseudo = pseudoHebr;
    			break;
    		default:
    			pseudo = pseudoLatn;
    			break;
    	}

    	String[] entry;
    	
    	for (int i = 0; i < pseudo.length; i++) {
    		entry = pseudo[i];
    		pseudoCharacters.put(entry[0], entry[1]);
    	}
    }

    /**
     * Returns target locale object as an Locale object
     * @return target locale instance
     */
    public Locale getLocale()
    {
        return targetLocale;
    }

    /**
     * Examines if source string has already been translated or not
     * 
     * @param source source string to be examined
     * @return true if source string is found in translations, otherwise - false
     */
    public boolean containsSource(String source)
    {
    	try {
    		Field f = R.getField(makeKey(source));
    		return f != null;
    	} catch (NoSuchFieldException e) {
    	}
    	
    	return false;
    }

    /**
     * Examines if given unique key has already been translated or not.
     * 
     * @param key unique key to be examined
     * @return true if source string or unique key are found in translations. False otherwise.
     */
    public boolean containsKey(String key)
    {
    	try {
    		Field f = R.getField(key);
    		return f != null;
    	} catch (NoSuchFieldException e) {
    	}
    	
    	return false;
    }

	/**
	 * Returns the base name of this bundle, if known, or null if unknown.
	 * @return base name of this bundle
	 */
    public String getBaseBundleName()
    {
        return name;
    }

    /**
     * Returns type of text information which ResBundle is being operating with (default type: raw)
     * @return input text type: html, xml, raw
     */
    public String getType()
    {
        return type;
    }

	/**
	 * Specifies type of text information which ResBundle is being operating with
	 * @param type input text specified type (default type: raw).
	 */
	public void setType(String type) {
		this.type = type.toLowerCase();
	}

	/**
	 * Returns lengthen option that allows to lengthen potential length for translated string (for UI/UX issues)
	 * using pseudo-localization.
	 * @return true if lengthen option is specified, false otherwise
	 */
	public boolean isLengthen() {
		return lengthen;
	}

	/**
	 * Specifies lengthen option to lengthen potential length for translated string (for UI/UX issues)
	 * using pseudo-localization.
	 * @param lengthen option allows to lengthen potential translated string length using pseudo string
	 * as returned instead.
	 */
	public void setLengthen(boolean lengthen) {
		this.lengthen = lengthen;
	}
	
	/**
	 * Returns missing option - that option specifies behavior in case when translation is not found
	 * by given key or value.<p>
	 * 
	 * Possible values:
	 * 
	 * <ul>
	 * <li>MissingType.SOURCE - return source string if translation is not found.
	 * <li>MissingType.PSEUDO - return pseudo localized string from source string if translation is not found.
	 * <li>MissingType.EMPTY  - return empty string if translation is not found.
	 * <li>MissingType.PLACEHOLDER - return a placeholder string instead.
	 * </ul>
	 * @return The type of strategy in use for missing strings
	 */
	public MissingType getMissing() {
		return missing;
	}

	/**
	 * Specifies missing option - option, that specifies behavior in case when translation is not found
	 * by given key or value.
	 * 
	 * Possible values:
	 * 
	 * <ul>
	 * <li>MissingType.SOURCE - return source string if translation is not found.
	 * <li>MissingType.PSEUDO - return pseudo localized string from source string if translation is not found.
	 * <li>MissingType.EMPTY  - return empty string if translation is not found.
	 * <li>MissingType.PLACEHOLDER - return a placeholder string instead.
	 * </ul>
	 * 
	 * @param type The type of strategy to use for missing strings
	 */
	public void setMissingType(MissingType type) {
		this.missing = type;
	}

	/**
	 * Returns pseudo string from input one using appropriate pseudomap
     * @param source input string needed to be pseudo localized
     * @return pseudo localized string
     */
    protected String pseudo(String source)
    {
		if ( source == null ) {
			return null;
		}
		
		StringBuilder ret = new StringBuilder();
		int i;
		
		for ( i = 0; i < source.length(); i++ ) {
			if ( !type.equals(RAW_TYPE) ) {
				if ( isHTML_XML_Type() ) {
					if (source.charAt(i) == '<') {
						ret.append(source.charAt(i++));
						while (i < source.length() && source.charAt(i) != '>') {
							ret.append(source.charAt(i++));
						}
						if (i < source.length()) {
							ret.append(source.charAt(i++));
						}
					} else if (source.charAt(i) == '&') {
						ret.append(source.charAt(i++));
						while (i < source.length() && source.charAt(i) != ';' && source.charAt(i) != ' ') {
							ret.append(source.charAt(i++));
						}
						if (i < source.length()) {
							ret.append(source.charAt(i++));
						}
					}
				}
				if (type.equals(JAVA_TYPE)) {
					if (i < source.length()) { 
						if (source.charAt(i) == '\\') {
							if (source.charAt(i+1) == 'u') {
								// unicode character
								if (i+5 < source.length()) {
									ret.append(source.substring(i, i+6));
									i += 6;
								}
							} else {
								// non-unicode character, so just skip the next character instead of pseudo-localizing it
								ret.append('\\');
								ret.append(source.charAt(i+1));
								i += 2;
							}
						} else if (source.charAt(i) == '%') {
							Matcher m = percentPattern.matcher(source.substring(i));
							if (m.find()) {
								ret.append(m.group(0));
								i += m.end() - m.start();
							} else {
								ret.append('%');
								i++;
							}
						}
					}
				}
				if (i < source.length()) { 
					if (source.charAt(i) == '{') {
						ret.append(source.charAt(i++));
						while (i < source.length() && source.charAt(i) != '}') {
							ret.append(source.charAt(i++));
						}
						if (i < source.length()) {
							ret.append(source.charAt(i));
						}
					} else {
						String c = source.substring(i, i+1);
						ret.append( getPseudoCharacter(c) );
					}
				}
			} else {
				String c = source.substring(i, i+1);
				ret.append( getPseudoCharacter(c) );				
			}
		}
		if (lengthen) {
			int add;
			if (ret.length() <= 20) {
				add = Math.round(ret.length() / 2);
			} else if (ret.length() > 20 && ret.length() <= 40) {
				add = Math.round(ret.length() / 3);
			} else {
				add = Math.round(ret.length() / 5);
			}
			for (i = add-1; i >= 0; i--) {
				ret.append("" + (i % 10));
			}
		}

		return ret.toString();
    }

    /**
     * Returns string with pseudo character that corresponds to the input one
     * @param character input character string
     * @return string with pseudo character if input character is found in appropriate pseudoMap,
     * 		otherwise - input character
     */
    protected String getPseudoCharacter(String character)
    {
    	return pseudoCharacters.containsKey(character) ? pseudoCharacters.get(character) : character;
    }

    /**
     * Replaces all xml and html tags occurences with corresponding replacements
     * @param str input string
     * @return string with no html- and xml-style tags
     */
    protected String escape(String str)
    {
    	if ( str == null )
			return null;

		String ret;
		ret = str.replaceAll("&", "&amp;");
		ret = ret.replaceAll("<", "&lt;");
		ret = ret.replaceAll(">", "&gt;");
		return ret;
    }

    /**
     * Invokes retroaction for escape(String) 
     * 
     * @see String escape(String str);
     * @param str input string
     * @return string with html- and xml-style tags
     */
    protected String unescape(String str)
    {
    	if ( str == null )
			return null;

		String ret;
		ret = str.replaceAll("&amp;", "&");
		ret = ret.replaceAll("&lt;", "<");
		ret = ret.replaceAll("&gt;", ">");
		return ret;
    }

    /**
     * Creates a unique key from given source string
     * @param source input source string
     * @return unique key that contains no spaces, and modified equals and colon signs
     */
    public String makeKey(String source)
    {
		if ( source == null )
			return null;

		// create a hash so that the id is unique and conforms to the syntax of a Java
		// identifier.
		
		String value = HashKey.hash(source);
		
		// System.out.println("String '" + source + "' hashes to " + value);
		
		return isHTML_XML_Type() ? unescape(value) : value;
    }
    
    /**
     * Return a string from the Android resources.
     * 
     * @param keyName name of the key to return
     * @return the string from the Android resources, or null if
     * the string was not found.
     */
    protected String getAndroidString(String keyName) {
    	try {
	    	Field f = R.getField(keyName);
	    	return resources.getString(f.getInt(null));
    	} catch (Exception e) {
    		return null;
    	}
    }
    
    /**
     * Returns translation for given source and key strings.
     * @param source source string to look up
     * @param key unique key for the string. If null - then unique key will be generated
     * based on the source string
     * @see #makeKey(String)
     * @return translation for target locale if it is exists, otherwise the source string 
     * @see MissingType
     */
    public String getString(String source, String key)
    {
		if (source == null && key == null) return null;

		if (targetLocale.getLanguage() == "zxx") {
			String str = (source != null) ? source : getAndroidString(key);
			return pseudo(str);
		}
		
		Matcher mStart = pStart.matcher(source);
		Matcher mEnd = pEnd.matcher(source);
		
		String whiteStart = mStart.find() ? mStart.group(0) : "";
		String whiteEnd = mEnd.find() ? mEnd.group(0) : "";
		
		return whiteStart + getTranslation(source, key) + whiteEnd;
	}

    /**
     * Get the translation of the given source string and key combination. At
     * least one of the source or the key must be specified.
     * 
     * @param source The source string written in the source language, or null
     * if no source string is available
     * @param key The unique key being sought, or null if no key is available
     * @return the translation for the given source string/key combination
     */
    protected String getTranslation(String source, String key)
    {
    	String keyName = null;
    	if (key != null && key.length() > 0) {
    		keyName = key;
    	} else {
    		if (source != null) {
    			keyName = containsKey(source) ? source : makeKey(source);
    		} else {
    			System.err.println("IResourceBundle: Incorrect translation parameters: key and source are both null!");
    			return "";
    		}
    	}

    	String trans = getAndroidString(keyName);

    	if (trans == null) {
    		switch (missing) {
	    		default:
				case SOURCE:
					trans = source;
					break;
				case PSEUDO:
					trans = (source != null) ? pseudo(source.trim()) : null;
					break;
				case EMPTY:
					trans = "";
					break;
				case PLACEHOLDER:
					trans = "????";
					break;
			}
    	}
    	
		if (isHTML_XML_Type() && trans != null) {
			trans = escape(trans);
		}
		
    	return trans;
    }

    /**
     * Return true if the output file type is HTML or XML.
     * 
     * @return true if the output file type is HTML or XML.
     */
    protected boolean isHTML_XML_Type()
    {
    	return (type.equals(XML_TYPE) || type.equals(HTML_TYPE));
    }

    /**
     * Retrieve a string from the resources based on the source
     * string or the key. If the source string is given, a key
     * will be made out of it and the key will be looked up in 
     * the resources. If a key is given, the key will be looked
     * up directly in the resources. If the string cannot be
     * looked up by either the source or the key, this method 
     * will use the current missing string strategy.
     * 
     * @param sourceOrKey A source string or unique key to look
     * up in the resources
     * @return the translation for the given source string or
     * key string
     */
    public String getString(String sourceOrKey)
    {
        return getString(sourceOrKey, null);
    }

    /**
     * Return the pseudo-translated version of the source string.
     * 
     * @param source the source string to translate.
     * @return the pseudo-translated version of the source string
     */
    public String getStringPseudo(String source) {
    	if (source == null) return null;

		return pseudo(source);
    }	
}
