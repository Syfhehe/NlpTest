package sample.util;

import java.io.BufferedReader;
import java.io.File;
import java.io.FileFilter;
import java.io.FileInputStream;
import java.io.InputStreamReader;
import java.util.ArrayList;
import java.util.List;

public class FileUtil {

	public static List<File> searchFile(File folder, final String suffix) {
		File[] subFolders = folder.listFiles(new FileFilter() {
			public boolean accept(File pathname) {
				if (pathname.isDirectory() || (pathname.isFile() && pathname.getName().endsWith(suffix)))
					return true;
				return false;
			}
		});
		List<File> result = new ArrayList<File>();
		for (int i = 0; i < subFolders.length; i++) {
			if (subFolders[i].isFile()) {
				result.add(subFolders[i]);
			} else {
				List<File> foldResult = searchFile(subFolders[i], suffix);
				for (int j = 0; j < foldResult.size(); j++) {
					result.add(foldResult.get(j));
				}
			}
		}
		return result;
	}

	public static int count(File file) {
		FileInputStream is = null;
		StringBuilder stringBuilder = null;
		try {
			if (file.length() != 0) {
				is = new FileInputStream(file);
				InputStreamReader streamReader = new InputStreamReader(is);
				BufferedReader reader = new BufferedReader(streamReader);
				String line;
				stringBuilder = new StringBuilder();
				while ((line = reader.readLine()) != null) {
					// stringBuilder.append(line);
					stringBuilder.append(line);
				}
				reader.close();
				is.close();
			}

		} catch (Exception e) {
			e.printStackTrace();
		}

		return String.valueOf(stringBuilder).length();
	}
}
