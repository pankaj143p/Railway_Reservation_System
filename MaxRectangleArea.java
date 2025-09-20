import java.util.*;

class Solution {
    public int Calculate(int N, int[] A) {
        Map<Integer, Integer> count = new HashMap<>();
        for (int x : A) {
            count.put(x, count.getOrDefault(x, 0) + 1);
            if (x > 0) count.put(x - 1, count.getOrDefault(x - 1, 0) + 1);
        }
        
        List<Integer> pairs = new ArrayList<>();
        for (Map.Entry<Integer, Integer> e : count.entrySet()) {
            int val = e.getKey(), cnt = e.getValue();
            while (cnt >= 2 && pairs.size() < 2) {
                pairs.add(val);
                cnt -= 2;
            }
        }
        
        if (pairs.size() < 2) return 0;
        pairs.sort(Collections.reverseOrder());
        return (int)((long)pairs.get(0) * pairs.get(1) % 1000000007);
    }
}