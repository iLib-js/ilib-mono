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
package com.healthtap.test;

import java.util.HashMap;
import java.util.Locale;

import com.healthtap.IResourceBundle;
import com.healthtap.IResourceBundle.MissingType;
import com.healthtap.IStringProvider;

import junit.framework.TestCase;


/**
 * @author edwin
 *
 */
public class IResourceBundleTest extends TestCase
{
	public class MockResources implements IStringProvider {
		protected HashMap<Integer,String> map = new HashMap<Integer,String>();
		
		public MockResources() {}
		
		public MockResources(Locale locale) {
			if (locale.getLanguage() == "fr") {
				map.put(1, "Connexion en cours...");
				map.put(6, "Services Palm");
			} else if (locale.getLanguage() == "de") {
				map.put(7, "Nicht aktualisieren");
			} else if (locale.getLanguage() == "es") {
				if (locale.getCountry() == "MX") {
					map.put(2, "Falló la opción de no participar. Intenta más tarde");
					map.put(3, "Listo");
					map.put(5, "Se ha enviado un mensaje de verificación a {email}.");
				} else {
					map.put(2, "Falló la opción de no participar. Intentarlo más tarde.");
					map.put(3, "Aceptar");
					map.put(5, "Se envió un mensaje de verificación a {email}.");
				}
			} else if (locale.getLanguage() == "it") {
				map.put(8,  "");
				map.put(9,  "");
			} else if (locale.getLanguage() == "zh") {
				if (locale.getCountry() == "CN") {
					map.put(4, "保持备份打开");
				} else {
					map.put(4, "保持備份打開");
				}
			}
		}

		public String getString(int id) {
			String translation = map.get(id);
			return translation;
		}
	}
		
	public void testConstructorNotNull()
	{
		MockResources res = new MockResources();
		IResourceBundle rb = new IResourceBundle(R.string.class, res);
		assertNotNull(rb);
	}
	
	public void testConstructorResourcesNotNull()
	{
		MockResources res = new MockResources();
		IResourceBundle rb = new IResourceBundle(R.string.class, res);
		assertNotNull(rb);
	}
	
	public void testNullLocale()
	{
		MockResources res = new MockResources();
		IResourceBundle rb = new IResourceBundle(R.string.class, res, null);
		assertNotNull(rb);
		
		assertEquals("en_US", rb.getLocale().toString());
	}
	
	public void testEmptyLocale()
	{
		Locale l = Locale.getDefault();
		MockResources res = new MockResources(l);
		IResourceBundle rb = new IResourceBundle(R.string.class, res, l);
		assertNotNull(rb);
		
		assertEquals("en_US", rb.getLocale().toString());
	}

	public void testConstructorResourcesAndLocale()
	{
		Locale l = Locale.forLanguageTag("fr-FR");
		MockResources res = new MockResources(l);
		IResourceBundle rb = new IResourceBundle(R.string.class, res, l);
		assertNotNull(rb);
	}

	public void testContainsSourceTrue()
	{
		Locale l = Locale.forLanguageTag("fr-FR");
		MockResources res = new MockResources(l);
		IResourceBundle resBundle = new IResourceBundle(R.string.class, res, l);
		assertNotNull(resBundle);
		
		String result = resBundle.getString("Signing in...");
		assertEquals("Connexion en cours...", result.toString());
	}

	public void testContainsSourceFalse()
	{
		Locale l = Locale.forLanguageTag("fr-FR");
		MockResources res = new MockResources(l);
		IResourceBundle resBundle = new IResourceBundle(R.string.class, res,l);
		assertNotNull(resBundle);
		
		String result = resBundle.getString("Palm Services");
		assertEquals("Services Palm", result.toString());
		assertNotSame("Palm Services", result.toString());
	}

	public void testGetLocStringBaseLocale1()
	{
		Locale l = Locale.forLanguageTag("es-ES");
		MockResources res = new MockResources(l);
		IResourceBundle resBundle = new IResourceBundle(R.string.class, res, l);
		assertNotNull(resBundle);
		
		String result = resBundle.getString("Opt out failed. Try later");
		assertEquals("Falló la opción de no participar. Intentarlo más tarde.", result.toString());
	}

	public void testGetLocStringNonBaseLocale1()
	{
		Locale l = Locale.forLanguageTag("es-MX");
		MockResources res = new MockResources(l);
		IResourceBundle resBundle = new IResourceBundle(R.string.class, res, l);
		assertNotNull(resBundle);
		
		String result = resBundle.getString("Opt out failed. Try later");
		assertEquals("Falló la opción de no participar. Intenta más tarde", result.toString());
		assertNotSame("Falló la opción de no participar. Intentarlo más tarde.", result.toString());
	}
	
	public void testGetLocStringBaseLocale2()
	{
		Locale l = Locale.forLanguageTag("es-ES");
		MockResources res = new MockResources(l);
		IResourceBundle resBundle = new IResourceBundle(R.string.class, res, l);
		assertNotNull(resBundle);
		
		String result = resBundle.getString("Done");
		assertEquals("Aceptar", result.toString());
	}

	public void testGetLocStringNonBaseLocale2()
	{
		Locale l = Locale.forLanguageTag("es-MX");
		MockResources res = new MockResources(l);
		IResourceBundle resBundle = new IResourceBundle(R.string.class, res, l);
		assertNotNull(resBundle);
		
		String result = resBundle.getString("Done");
		assertEquals("Listo", result.toString());
		assertNotSame("Aceptar", result.toString());
	}
	
	public void testGetLocStringBaseLocale3()
	{
		Locale l = Locale.forLanguageTag("zh-Hans-CN");
		MockResources res = new MockResources(l);
		IResourceBundle resBundle = new IResourceBundle(R.string.class, res, l);
		assertNotNull(resBundle);
		
		String result = resBundle.getString("Keep Backup On");
		assertEquals("保持备份打开", result.toString());
	}

	public void testGetLocStringNonBaseLocale3()
	{
		Locale l = Locale.forLanguageTag("zh-HK");
		MockResources res = new MockResources(l);
		IResourceBundle resBundle = new IResourceBundle(R.string.class, res, l);
		assertNotNull(resBundle);
		
		String result = resBundle.getString("Keep Backup On");
		assertEquals("保持備份打開", result.toString());
		assertNotSame("保持备份打开", result.toString());
	}
	
	public void testGetLocStringWithExistedKey1()
	{
		Locale l = Locale.forLanguageTag("es-ES");
		MockResources res = new MockResources(l);
		IResourceBundle resBundle = new IResourceBundle(R.string.class, res, l);
		assertNotNull(resBundle);
		
		String result = resBundle.getString("A verification email was sent to {email}.");
		assertEquals("Se envió un mensaje de verificación a {email}.", result);
	}

	public void testGetLocStringWithExistedKey2()
	{
		Locale l = Locale.forLanguageTag("es-MX");
		MockResources res = new MockResources(l);
		IResourceBundle resBundle = new IResourceBundle(R.string.class, res, l);
		assertNotNull(resBundle);
		
		String result = resBundle.getString("A verification email was sent to {email}.");
		assertNotSame("Se envió un mensaje de verificación a {email}.", result);
		assertEquals("Se ha enviado un mensaje de verificación a {email}.", result);
	}

	public void testGetLocStringWithNonExistedKey1()
	{
		Locale l = Locale.forLanguageTag("de-DE");
		MockResources res = new MockResources(l);
		IResourceBundle resBundle = new IResourceBundle(R.string.class, res, l);
		assertNotNull(resBundle);
		
		// right string, wrong key means no match
		String result = resBundle.getString("Email Sent", "emailsent");
		assertEquals("Email Sent", result.toString());
		// assertEquals("emailsent", result.toString());
	}

	public void testGetLocStringEchoWhitespace()
	{
		Locale l = Locale.forLanguageTag("es-ES");
		MockResources res = new MockResources(l);
		IResourceBundle resBundle = new IResourceBundle(R.string.class, res, l);
		assertNotNull(resBundle);
		
		String result = resBundle.getString("Done");
		assertEquals("Aceptar", result.toString());
		
		result = resBundle.getString("   Done");
		assertEquals("   Aceptar", result.toString());

		result = resBundle.getString("Done   ");
		assertEquals("Aceptar   ", result.toString());

		result = resBundle.getString("  Done   ");
		assertEquals("  Aceptar   ", result.toString());
		
		result = resBundle.getString(" \t\n Done  \t\t\n ");
		assertEquals(" \t\n Aceptar  \t\t\n ", result.toString());
	}

	public void testGetLocaleWithResourcesGermany()
	{
		final Locale locale = Locale.forLanguageTag("de-DE");
		MockResources res = new MockResources(locale);
		IResourceBundle resBundle = new IResourceBundle(R.string.class, res, locale);
		assertNotNull(resBundle);

		assertEquals(locale.toString(), resBundle.getLocale().toString());
	}

	public void testGetLocaleWithResourcesNetherlands()
	{
		final Locale locale = Locale.forLanguageTag("nl-NL");
		MockResources res = new MockResources(locale);
		IResourceBundle resBundle = new IResourceBundle(R.string.class, res, locale);
		assertNotNull(resBundle);

		assertEquals(locale.toString(), resBundle.getLocale().toString());
	}
	
	public void testGetStringDefaultPseudo()
	{
		final Locale locale = Locale.forLanguageTag("zxx");
		MockResources res = new MockResources(locale);
		IResourceBundle resBundle = new IResourceBundle(R.string.class, res, locale);
		assertNotNull(resBundle);

		assertEquals("Ïñvàľíð Ňëţŵõŕķ Ňàmë9876543210", resBundle.getString("Invalid Network Name").toString());
	}

	public void testGetStringCyrlPseudo()
	{
		final Locale locale = Locale.forLanguageTag("zxx-Cyrl-RU");
		MockResources res = new MockResources(locale);
		IResourceBundle resBundle = new IResourceBundle(R.string.class, res, locale);
		assertNotNull(resBundle);

		assertEquals("Инвалид Нэтwорк Намэ9876543210", resBundle.getString("Invalid Network Name").toString());
	}

	public void testGetStringPseudo()
	{
		final Locale locale = Locale.forLanguageTag("de-DE");
		MockResources res = new MockResources(locale);
		IResourceBundle resBundle = new IResourceBundle(R.string.class, res, locale);
		assertNotNull(resBundle);

		assertEquals("àçţüàľ šţàţë fõŕ Ŵífí: 6543210", resBundle.getStringPseudo("actual state for Wifi: ").toString());
	}

	public void testGetStringPseudoMissing()
	{
		final Locale locale = Locale.forLanguageTag("de-DE");
		MockResources res = new MockResources(locale);
		IResourceBundle resBundle = new IResourceBundle(R.string.class, res, locale);
		resBundle.setMissingType(MissingType.PSEUDO);
		assertNotNull(resBundle);

		assertEquals("Nicht aktualisieren", resBundle.getString("Don't Update").toString());
		assertEquals("Ðõñ'ţ Úþðàţë àñ ëmàíľ6543210", resBundle.getString("Don't Update an email").toString());

	}

	public void testGetStringPseudoMissingLengthenFalse()
	{
		final Locale locale = Locale.forLanguageTag("de-DE");
		MockResources res = new MockResources(locale);
		IResourceBundle resBundle = new IResourceBundle(R.string.class, res, locale);
		resBundle.setMissingType(MissingType.PSEUDO);
		resBundle.setLengthen(false);
		assertNotNull(resBundle);

		assertEquals("Ðõñ'ţ Úþðàţë àñ ëmàíľ", resBundle.getString("Don't Update an email").toString());
		assertNotSame("Ðõñ'ţ Úþðàţë àñ ëmàíľ6543210", resBundle.getString("Don't Update an email").toString());
	}
	
	public void testGetStringKeyValueNull()
	{
		final Locale locale = Locale.forLanguageTag("de-DE");
		MockResources res = new MockResources(locale);
		IResourceBundle resBundle = new IResourceBundle(R.string.class, res, locale);
		assertNotNull(resBundle);

		assertNull(resBundle.getString(null));
	}

	public void testGetStringEmptyMissing()
	{
		final Locale locale = Locale.forLanguageTag("de-DE");
		MockResources res = new MockResources(locale);
		IResourceBundle resBundle = new IResourceBundle(R.string.class, res, locale);
		resBundle.setMissingType(MissingType.EMPTY);
		assertNotNull(resBundle);

		assertEquals("", resBundle.getString("Don't Update an email").toString());
	}

	public void testGetPseudoStringLatnScript()
	{
		final Locale locale = Locale.forLanguageTag("en-GB");
		MockResources res = new MockResources(locale);
		IResourceBundle resBundle = new IResourceBundle(R.string.class, res, locale);
		resBundle.setMissingType(MissingType.PSEUDO);
		assertNotNull(resBundle);

		assertEquals("Ëñğàğëmëñţ þõíñţ!76543210", resBundle.getString("Engagement point!").toString());
	}

	public void testGetPseudoStringCyrlScript()
	{
		final Locale locale = Locale.forLanguageTag("uk-UA");
		MockResources res = new MockResources(locale);
		IResourceBundle resBundle = new IResourceBundle(R.string.class, res, locale);
		resBundle.setMissingType(MissingType.PSEUDO);
		assertNotNull(resBundle);

		assertEquals("Энгагэмэнт поинт!76543210", resBundle.getString("Engagement point!").toString());
	}

	public void testGetPseudoStringHebrScript()
	{
		final Locale locale = Locale.forLanguageTag("he-IL");
		MockResources res = new MockResources(locale);
		IResourceBundle resBundle = new IResourceBundle(R.string.class, res, locale);
		resBundle.setMissingType(MissingType.PSEUDO);
		assertNotNull(resBundle);

		assertEquals("ֶנגַגֶמֶנט פִֹנט!76543210", resBundle.getString("Engagement point!").toString());
	}
	
	public void testGetPseudoStringHansScript()
	{
		final Locale locale = Locale.forLanguageTag("zh-HK");
		MockResources res = new MockResources(locale);
		IResourceBundle resBundle = new IResourceBundle(R.string.class, res, locale);
		resBundle.setMissingType(MissingType.PSEUDO);
		resBundle.setLengthen(false);
		assertNotNull(resBundle);

		assertEquals("俄尼个阿个俄们俄尼推 琶夥意尼推!",resBundle.getString("Engagement point!").toString());
	}
	
	public void testGetStringPseudoTypeJava()
	{
		final Locale locale = Locale.forLanguageTag("de-DE");
		MockResources res = new MockResources(locale);
		IResourceBundle resBundle = new IResourceBundle(R.string.class, res, locale);
		resBundle.setType(IResourceBundle.JAVA_TYPE);
		assertNotNull(resBundle);

		assertEquals("àçţüàľ šţàţë fõŕ Ŵífí: {0}76543210", resBundle.getStringPseudo("actual state for Wifi: {0}").toString());
	}
	
	public void testGetStringPseudoTypeJavaSkipEscapedUnicode()
	{
		final Locale locale = Locale.forLanguageTag("de-DE");
		MockResources res = new MockResources(locale);
		 IResourceBundle resBundle = new IResourceBundle(R.string.class, res, locale);
		resBundle.setType(IResourceBundle.JAVA_TYPE);
		assertNotNull(resBundle);

		assertEquals("àçţüàľ šţàţë fõŕ Ŵífí: \u00A076543210", resBundle.getStringPseudo("actual state for Wifi: \u00A0").toString());
	}
	
	public void testGetStringPseudoTypeJavaSkipReplacementParams()
	{
		final Locale locale = Locale.forLanguageTag("de-DE");
		MockResources res = new MockResources(locale);
		IResourceBundle resBundle = new IResourceBundle(R.string.class, res, locale);
		resBundle.setType(IResourceBundle.JAVA_TYPE);
		assertNotNull(resBundle);

		assertEquals("àçţüàľ šţàţë fõŕ Ŵífí: {foobar}9876543210", resBundle.getStringPseudo("actual state for Wifi: {foobar}").toString());
	}
	
	public void testGetPseudoStringEchoWhitespace()
	{
		final Locale locale = Locale.forLanguageTag("en-GB");
		MockResources res = new MockResources(locale);
		IResourceBundle resBundle = new IResourceBundle(R.string.class, res, locale);
		resBundle.setMissingType(MissingType.PSEUDO);
		assertNotNull(resBundle);

		assertEquals("    Ëñğàğëmëñţ þõíñţ!76543210\n\n", resBundle.getString("    Engagement point!\n\n").toString());
	}

	/*
	 Do we even need this?
	public void testGetStringPseudoTypeJavaSkipHTMLTags()
	{
		final Locale locale = Locale.forLanguageTag("de-DE");
		MockResources res = new MockResources(locale);
		IResourceBundle resBundle = new IResourceBundle(R.string.class, res, locale);
		resBundle.setType(IResourceBundle.JAVA_TYPE);
		assertNotNull(resBundle);

		assertEquals("àçţüàľ <span class=\"foo\">šţàţë</span> fõŕ Ŵífí: {foobar}9876543210", resBundle.getStringPseudo("actual <span class=\"foo\">state</span> for Wifi: {foobar}").toString());
	}
	*/
	
	public void testGetStringPseudoTypeJavaSkipPercentReplacements()
	{
		final Locale locale = Locale.forLanguageTag("de-DE");
		MockResources res = new MockResources(locale);
		IResourceBundle resBundle = new IResourceBundle(R.string.class, res, locale);
		resBundle.setType(IResourceBundle.JAVA_TYPE);
		assertNotNull(resBundle);

		assertEquals("àçţüàľ %s 43210", resBundle.getStringPseudo("actual %s ").toString());
		assertEquals("àçţüàľ %b 43210", resBundle.getStringPseudo("actual %b ").toString());
		assertEquals("àçţüàľ %h 43210", resBundle.getStringPseudo("actual %h ").toString());
		assertEquals("àçţüàľ %c 43210", resBundle.getStringPseudo("actual %c ").toString());
		assertEquals("àçţüàľ %d 43210", resBundle.getStringPseudo("actual %d ").toString());
		assertEquals("àçţüàľ %o 43210", resBundle.getStringPseudo("actual %o ").toString());
		assertEquals("àçţüàľ %x 43210", resBundle.getStringPseudo("actual %x ").toString());
		assertEquals("àçţüàľ %e 43210", resBundle.getStringPseudo("actual %e ").toString());
		assertEquals("àçţüàľ %f 43210", resBundle.getStringPseudo("actual %f ").toString());
		assertEquals("àçţüàľ %g 43210", resBundle.getStringPseudo("actual %g ").toString());
		assertEquals("àçţüàľ %a 43210", resBundle.getStringPseudo("actual %a ").toString());
		assertEquals("àçţüàľ %t 43210", resBundle.getStringPseudo("actual %t ").toString());
		assertEquals("àçţüàľ %% 43210", resBundle.getStringPseudo("actual %% ").toString());
		assertEquals("àçţüàľ %n 43210", resBundle.getStringPseudo("actual %n ").toString());
		
		assertEquals("àçţüàľ %S 43210", resBundle.getStringPseudo("actual %S ").toString());
		assertEquals("àçţüàľ %B 43210", resBundle.getStringPseudo("actual %B ").toString());
		assertEquals("àçţüàľ %H 43210", resBundle.getStringPseudo("actual %H ").toString());
		assertEquals("àçţüàľ %C 43210", resBundle.getStringPseudo("actual %C ").toString());
		assertEquals("àçţüàľ %X 43210", resBundle.getStringPseudo("actual %X ").toString());
		assertEquals("àçţüàľ %E 43210", resBundle.getStringPseudo("actual %E ").toString());
		assertEquals("àçţüàľ %G 43210", resBundle.getStringPseudo("actual %G ").toString());
		assertEquals("àçţüàľ %A 43210", resBundle.getStringPseudo("actual %A ").toString());
		assertEquals("àçţüàľ %T 43210", resBundle.getStringPseudo("actual %T ").toString());
		assertEquals("àçţüàľ %% 43210", resBundle.getStringPseudo("actual %% ").toString());
		
		assertEquals("àçţüàľ %2$s 543210", resBundle.getStringPseudo("actual %2$s ").toString());
		assertEquals("àçţüàľ %-d 43210", resBundle.getStringPseudo("actual %-d ").toString());
		assertEquals("àçţüàľ %#d 43210", resBundle.getStringPseudo("actual %#d ").toString());
		assertEquals("àçţüàľ %+d 43210", resBundle.getStringPseudo("actual %+d ").toString());
		assertEquals("àçţüàľ % d 43210", resBundle.getStringPseudo("actual % d ").toString());
		assertEquals("àçţüàľ %02d 543210", resBundle.getStringPseudo("actual %02d ").toString());
		assertEquals("àçţüàľ %.2d 543210", resBundle.getStringPseudo("actual %.2d ").toString());
		assertEquals("àçţüàľ %(2d 543210", resBundle.getStringPseudo("actual %(2d ").toString());
		assertEquals("àçţüàľ %4$-2.2d 76543210", resBundle.getStringPseudo("actual %4$-2.2d ").toString());
		
		assertEquals("àçţüàľ %Ň 43210", resBundle.getStringPseudo("actual %N ").toString());
		assertEquals("àçţüàľ %F 43210", resBundle.getStringPseudo("actual %F ").toString());
		assertEquals("àçţüàľ %Ð 43210", resBundle.getStringPseudo("actual %D ").toString());
		assertEquals("àçţüàľ %Ø 43210", resBundle.getStringPseudo("actual %O ").toString());
	}
	
	public void testMakeKeySimpleTexts1()
	{
		final Locale locale = Locale.forLanguageTag("de-DE");
		MockResources res = new MockResources(locale);
		IResourceBundle resBundle = new IResourceBundle(R.string.class, res, locale);
		resBundle.setType(IResourceBundle.JAVA_TYPE);
		assertNotNull(resBundle);
		
        assertEquals("r372802078", resBundle.makeKey("Preferences in your profile"));
		assertEquals("r725930887", resBundle.makeKey("All settings"));
		assertEquals("r734599412", resBundle.makeKey("Colour scheme"));
		assertEquals("r343852585", resBundle.makeKey("Experts"));
	}

	public void testMakeKeySimpleTexts2()
	{
		final Locale locale = Locale.forLanguageTag("de-DE");
		MockResources res = new MockResources(locale);
		IResourceBundle resBundle = new IResourceBundle(R.string.class, res, locale);
		resBundle.setType(IResourceBundle.JAVA_TYPE);
		assertNotNull(resBundle);
		
		assertEquals("r807691021", resBundle.makeKey("Procedures"));
        assertEquals("r898923204", resBundle.makeKey("Mobile Apps"));
        assertEquals("r618035987", resBundle.makeKey("Settings in your profile"));
        assertEquals("r175350918", resBundle.makeKey("Product Reviews"));
        assertEquals("r221604632", resBundle.makeKey("Answers"));
	}

	public void testMakeKeySimpleTexts3()
	{
		final Locale locale = Locale.forLanguageTag("de-DE");
		MockResources res = new MockResources(locale);
		IResourceBundle resBundle = new IResourceBundle(R.string.class, res, locale);
		resBundle.setType(IResourceBundle.JAVA_TYPE);
		assertNotNull(resBundle);
				
        assertEquals("r314592735", resBundle.makeKey("Private Profile"));
        assertEquals("r711926199", resBundle.makeKey("People you are connected to"));
        assertEquals("r284964820", resBundle.makeKey("Notifications"));
        assertEquals("r613036745", resBundle.makeKey("News"));
        assertEquals("r216617786", resBundle.makeKey("More Tips"));
        assertEquals("r81370429", resBundle.makeKey("Filters"));
        assertEquals("r140625167", resBundle.makeKey("Referral Link"));
        assertEquals("r256277957", resBundle.makeKey("Questions"));
	}

	public void testMakeKeyEscapes()
	{
		final Locale locale = Locale.forLanguageTag("de-DE");
		MockResources res = new MockResources(locale);
		IResourceBundle resBundle = new IResourceBundle(R.string.class, res, locale);
		resBundle.setType(IResourceBundle.JAVA_TYPE);
		
		assertEquals("r743945592", resBundle.makeKey("Can\'t find id"));
		assertEquals("r909283218", resBundle.makeKey("Can\'t find an application for SMS"));
	}
	
	public void testMakeKeyPunctuation()
	{
		final Locale locale = Locale.forLanguageTag("de-DE");
		MockResources res = new MockResources(locale);
		IResourceBundle resBundle = new IResourceBundle(R.string.class, res, locale);
		resBundle.setType(IResourceBundle.JAVA_TYPE);
		
		assertEquals("r382554039", resBundle.makeKey("{topic_name}({topic_generic_name})"));

        assertEquals("r300446104", resBundle.makeKey("{name}({generic_name})"));
		assertEquals("r8321889", resBundle.makeKey("{name}, {sharer_name} {start}found this interesting{end}"));
		assertEquals("r639868344", resBundle.makeKey("{sharer_name} {start}found this interesting{end}"));
		assertEquals("r895214324", resBundle.makeKey("Grow your Network"));
		assertEquals("r1015770123", resBundle.makeKey("Failed to send connection request!"));
		assertEquals("r993422001", resBundle.makeKey("{goal_name} Goals"));
		assertEquals("r180897411", resBundle.makeKey("Connection link copied!"));
	}
	
	public void testMakeKeyCompressWhiteSpace()
	{
		final Locale locale = Locale.forLanguageTag("de-DE");
		MockResources res = new MockResources(locale);
		IResourceBundle resBundle = new IResourceBundle(R.string.class, res, locale);
		resBundle.setType(IResourceBundle.JAVA_TYPE);
		
		assertEquals("r743945592", resBundle.makeKey("Can\'t find  id"));
		assertEquals("r743945592", resBundle.makeKey("Can\'t    find               id"));
		
		assertEquals("r909283218", resBundle.makeKey("Can\'t find an application for SMS"));
		assertEquals("r909283218", resBundle.makeKey("Can\'t   \t\n \t   find an    \t \n \r   application for SMS"));
	}

	public void testMakeKeyUnicodeEscapes()
	{
		final Locale locale = Locale.forLanguageTag("de-DE");
		MockResources res = new MockResources(locale);
		IResourceBundle resBundle = new IResourceBundle(R.string.class, res, locale);
		resBundle.setType(IResourceBundle.JAVA_TYPE);
		
		assertEquals("r969175354", resBundle.makeKey("Talk to a support representative live 24/7 via video or \u00a0 text\u00a0chat"));
	}

	public void testMakeKeyTrimWhiteSpace()
	{
		final Locale locale = Locale.forLanguageTag("de-DE");
		MockResources res = new MockResources(locale);
		IResourceBundle resBundle = new IResourceBundle(R.string.class, res, locale);
		resBundle.setType(IResourceBundle.JAVA_TYPE);
		
		assertEquals("r743945592", resBundle.makeKey("Can\'t find  id"));
		assertEquals("r743945592", resBundle.makeKey("      Can\'t find  id "));
		
		assertEquals("r909283218", resBundle.makeKey("Can\'t find an application for SMS"));
		assertEquals("r909283218", resBundle.makeKey(" \t\t\n\r    Can\'t find an application for SMS   \n \t \r"));
	}

	public void testMakeKeyRubyCompatibility()
	{
		final Locale locale = Locale.forLanguageTag("de-DE");
		MockResources res = new MockResources(locale);
		IResourceBundle resBundle = new IResourceBundle(R.string.class, res, locale);
		resBundle.setType(IResourceBundle.JAVA_TYPE);
		
        assertEquals("r487572481", resBundle.makeKey("This has \\\"double quotes\\\" in it."));
        assertEquals("r900797640", resBundle.makeKey("This has \\\'single quotes\\\' in it."));
        assertEquals("r494590307", resBundle.makeKey("This is a double quoted string"));
        assertEquals("r683276274", resBundle.makeKey("This is a single quoted string"));
        assertEquals("r246354917", resBundle.makeKey("This is a double quoted string with \\\"quotes\\\" in it."));
        assertEquals("r248819747", resBundle.makeKey("This is a single quoted string with \\\'quotes\\\' in it."));
        assertEquals("r1001831480", resBundle.makeKey("This is a double quoted string with \\n return chars in it"));
        assertEquals("r147719125", resBundle.makeKey("This is a single quoted string with \\n return chars in it"));
        assertEquals("r276797171", resBundle.makeKey("This is a double quoted string with \\t tab chars in it"));
        assertEquals("r303137748", resBundle.makeKey("This is a single quoted string with \\t tab chars in it"));
	}
}
