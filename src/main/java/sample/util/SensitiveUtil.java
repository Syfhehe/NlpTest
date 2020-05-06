package sample.util;

import java.util.HashMap;
import java.util.HashSet;
import java.util.Iterator;
import java.util.Map;
import java.util.Set;

public class SensitiveUtil {

	private Map<Object, Object> sensitiveWordsMap;

	private static final String END_FLAG = "end";

	@SuppressWarnings("unchecked")
	public void initSensitiveWordsMap(Set<String> sensitiveWords) {
		if (sensitiveWords == null || sensitiveWords.isEmpty()) {
			throw new IllegalArgumentException("Senditive words must not be empty!");
		}
		sensitiveWordsMap = new HashMap<>(sensitiveWords.size());
		String currentWord;
		Map<Object, Object> currentMap;
		Map<Object, Object> subMap;
		Iterator<String> iterator = sensitiveWords.iterator();
		while (iterator.hasNext()) {
			currentWord = iterator.next();
			if (currentWord == null || currentWord.trim().length() < 2) {
				continue;
			}
			currentMap = sensitiveWordsMap;
			for (int i = 0; i < currentWord.length(); i++) {
				char c = currentWord.charAt(i);
				subMap = (Map<Object, Object>) currentMap.get(c);
				if (subMap == null) {
					subMap = new HashMap<>();
					currentMap.put(c, subMap);
					currentMap = subMap;
				} else {
					currentMap = subMap;
				}
				if (i == currentWord.length() - 1) {
					currentMap.put(END_FLAG, null);
				}
			}
		}
	}

	public enum MatchType {

		MIN_MATCH("最小匹配规则"), MAX_MATCH("最大匹配规则");

		String desc;

		MatchType(String desc) {
			this.desc = desc;
		}
	}

	public Map<String, Integer> getSensitiveWords(String text, MatchType matchType) {
		if (text == null || text.trim().length() == 0) {
			throw new IllegalArgumentException("The input text must not be empty.");
		}
		Map<String, Integer> sensitiveWords = new HashMap<String, Integer>();
		for (int i = 0; i < text.length(); i++) {
			int sensitiveWordLength = getSensitiveWordLength(text, i, matchType);
			if (sensitiveWordLength > 0) {
				String sensitiveWord = text.substring(i, i + sensitiveWordLength);
				if (sensitiveWords.get(sensitiveWord) != null)
					sensitiveWords.put(sensitiveWord, sensitiveWords.get(sensitiveWord) + 1);
				else
					sensitiveWords.put(sensitiveWord, 1);
				if (matchType == MatchType.MIN_MATCH) {
					break;
				}
				i = i + sensitiveWordLength - 1;
			}
		}
		return sensitiveWords;
	}

	@SuppressWarnings("unchecked")
	public int getSensitiveWordLength(String text, int startIndex, MatchType matchType) {
		if (text == null || text.trim().length() == 0) {
			throw new IllegalArgumentException("The input text must not be empty.");
		}
		char currentChar;
		Map<Object, Object> currentMap = sensitiveWordsMap;
		int wordLength = 0;
		boolean endFlag = false;
		for (int i = startIndex; i < text.length(); i++) {
			currentChar = text.charAt(i);
			Map<Object, Object> subMap = (Map<Object, Object>) currentMap.get(currentChar);
			if (subMap == null) {
				break;
			} else {
				wordLength++;
				if (subMap.containsKey(END_FLAG)) {
					endFlag = true;
					if (matchType == MatchType.MIN_MATCH) {
						break;
					} else {
						currentMap = subMap;
					}
				} else {
					currentMap = subMap;
				}
			}
		}
		if (!endFlag) {
			wordLength = 0;
		}
		return wordLength;
	}

	public static void main(String[] args) {
		Set<String> sensitiveWords = new HashSet<>();
		sensitiveWords.add("你是傻逼");
		sensitiveWords.add("你是傻逼啊");
		sensitiveWords.add("你是坏蛋");
		sensitiveWords.add("你个大笨蛋");
		sensitiveWords.add("我去年买了个表");
		sensitiveWords.add("shit");

		SensitiveUtil textFilter = new SensitiveUtil();
		textFilter.initSensitiveWordsMap(sensitiveWords);
		String text = "你你你你是傻逼啊你，说你呢，你个大笨蛋，sss你个大笨蛋，啊是巨大你个大笨蛋。";
		System.out.println(textFilter.getSensitiveWords(text, MatchType.MAX_MATCH));
	}

}
