import { useState, useEffect, useCallback } from "react";
import {
  View, Text, FlatList, StyleSheet, TouchableOpacity,
  TextInput, RefreshControl, ActivityIndicator, Alert, Image
} from "react-native";
import { feedApi } from "../../lib/api";
import { useAuth } from "../../contexts/AuthContext";
import { Colors, Spacing, BorderRadius, Typography } from "../../lib/theme";

interface Post {
  id: number;
  content: string;
  postType?: string;
  mediaUrls?: string[];
  likesCount: number;
  commentsCount: number;
  createdAt: string;
  authorName: string;
  authorAvatar?: string;
  userId: number;
}

function PostCard({ post, onLike }: { post: Post; onLike: (id: number) => void }) {
  const timeAgo = (date: string) => {
    const diff = Date.now() - new Date(date).getTime();
    const mins = Math.floor(diff / 60000);
    if (mins < 60) return `${mins}m`;
    const hrs = Math.floor(mins / 60);
    if (hrs < 24) return `${hrs}h`;
    return `${Math.floor(hrs / 24)}d`;
  };

  return (
    <View style={styles.postCard}>
      <View style={styles.postHeader}>
        <View style={styles.avatar}>
          <Text style={styles.avatarText}>
            {post.authorName?.charAt(0)?.toUpperCase() || "A"}
          </Text>
        </View>
        <View style={styles.postMeta}>
          <Text style={styles.authorName}>{post.authorName || "Athlete"}</Text>
          <Text style={styles.postTime}>{timeAgo(post.createdAt)}</Text>
        </View>
        {post.postType && (
          <View style={styles.postTypeBadge}>
            <Text style={styles.postTypeText}>{post.postType}</Text>
          </View>
        )}
      </View>

      <Text style={styles.postContent}>{post.content}</Text>

      <View style={styles.postActions}>
        <TouchableOpacity style={styles.actionBtn} onPress={() => onLike(post.id)}>
          <Text style={styles.actionIcon}>⚡</Text>
          <Text style={styles.actionCount}>{post.likesCount || 0}</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.actionBtn}>
          <Text style={styles.actionIcon}>💬</Text>
          <Text style={styles.actionCount}>{post.commentsCount || 0}</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.actionBtn}>
          <Text style={styles.actionIcon}>🔄</Text>
          <Text style={styles.actionCount}>Share</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

export default function FeedScreen() {
  const { user } = useAuth();
  const [posts, setPosts] = useState<Post[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [newPost, setNewPost] = useState("");
  const [posting, setPosting] = useState(false);

  useEffect(() => { loadFeed(); }, []);

  async function loadFeed() {
    try {
      const data = await feedApi.getFeed(20, 0);
      setPosts(data || []);
    } catch (err) {
      console.error("Feed error:", err);
    } finally {
      setLoading(false);
    }
  }

  const onRefresh = useCallback(async () => {
    setRefreshing(true);
    await loadFeed();
    setRefreshing(false);
  }, []);

  async function handlePost() {
    if (!newPost.trim()) return;
    setPosting(true);
    try {
      await feedApi.createPost(newPost.trim());
      setNewPost("");
      await loadFeed();
    } catch (err: any) {
      Alert.alert("Error", err.message || "Failed to post");
    } finally {
      setPosting(false);
    }
  }

  async function handleLike(postId: number) {
    try {
      await feedApi.likePost(postId);
      setPosts(prev => prev.map(p =>
        p.id === postId ? { ...p, likesCount: (p.likesCount || 0) + 1 } : p
      ));
    } catch {}
  }

  if (loading) {
    return (
      <View style={styles.centered}>
        <ActivityIndicator size="large" color={Colors.cyan} />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      {/* Compose Box */}
      {user && (
        <View style={styles.composeBox}>
          <View style={styles.composeAvatar}>
            <Text style={styles.composeAvatarText}>
              {user.name?.charAt(0)?.toUpperCase() || "A"}
            </Text>
          </View>
          <View style={styles.composeInput}>
            <TextInput
              style={styles.composeText}
              value={newPost}
              onChangeText={setNewPost}
              placeholder="Share your X-Factor moment..."
              placeholderTextColor={Colors.textMuted}
              multiline
              maxLength={500}
            />
            <TouchableOpacity
              style={[styles.postBtn, !newPost.trim() && styles.postBtnDisabled]}
              onPress={handlePost}
              disabled={!newPost.trim() || posting}
            >
              {posting ? (
                <ActivityIndicator size="small" color="#FFF" />
              ) : (
                <Text style={styles.postBtnText}>Post</Text>
              )}
            </TouchableOpacity>
          </View>
        </View>
      )}

      {/* Feed */}
      <FlatList
        data={posts}
        keyExtractor={(item) => item.id.toString()}
        renderItem={({ item }) => <PostCard post={item} onLike={handleLike} />}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} tintColor={Colors.cyan} />
        }
        contentContainerStyle={styles.feedList}
        ListEmptyComponent={
          <View style={styles.empty}>
            <Text style={styles.emptyIcon}>⚡</Text>
            <Text style={styles.emptyTitle}>No posts yet</Text>
            <Text style={styles.emptySubtitle}>Be the first to share your X-Factor moment</Text>
          </View>
        }
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: Colors.background },
  centered: { flex: 1, justifyContent: "center", alignItems: "center", backgroundColor: Colors.background },
  composeBox: {
    flexDirection: "row",
    padding: Spacing.md,
    backgroundColor: Colors.surface,
    borderBottomWidth: 1,
    borderBottomColor: Colors.border,
    gap: Spacing.sm,
  },
  composeAvatar: {
    width: 40, height: 40, borderRadius: 20,
    backgroundColor: Colors.blue, justifyContent: "center", alignItems: "center",
  },
  composeAvatarText: { color: "#FFF", fontWeight: "700", fontSize: 16 },
  composeInput: { flex: 1, gap: 8 },
  composeText: {
    color: Colors.textPrimary, fontSize: 15,
    minHeight: 40, maxHeight: 100,
  },
  postBtn: {
    alignSelf: "flex-end",
    backgroundColor: Colors.blue,
    paddingHorizontal: 16, paddingVertical: 8,
    borderRadius: BorderRadius.full,
  },
  postBtnDisabled: { opacity: 0.4 },
  postBtnText: { color: "#FFF", fontWeight: "700", fontSize: 13 },
  feedList: { paddingBottom: 20 },
  postCard: {
    backgroundColor: Colors.surface,
    marginHorizontal: Spacing.md,
    marginTop: Spacing.sm,
    borderRadius: BorderRadius.lg,
    padding: Spacing.md,
    borderWidth: 1,
    borderColor: Colors.border,
  },
  postHeader: { flexDirection: "row", alignItems: "center", marginBottom: Spacing.sm, gap: Spacing.sm },
  avatar: {
    width: 40, height: 40, borderRadius: 20,
    backgroundColor: Colors.blue, justifyContent: "center", alignItems: "center",
  },
  avatarText: { color: "#FFF", fontWeight: "700", fontSize: 16 },
  postMeta: { flex: 1 },
  authorName: { ...Typography.h4, fontSize: 15 },
  postTime: { ...Typography.caption, marginTop: 2 },
  postTypeBadge: {
    backgroundColor: Colors.navyLight, paddingHorizontal: 8, paddingVertical: 4,
    borderRadius: BorderRadius.sm, borderWidth: 1, borderColor: Colors.border,
  },
  postTypeText: { color: Colors.cyan, fontSize: 11, fontWeight: "600" },
  postContent: { ...Typography.body, lineHeight: 22, marginBottom: Spacing.md },
  postActions: { flexDirection: "row", gap: Spacing.lg, paddingTop: Spacing.sm, borderTopWidth: 1, borderTopColor: Colors.border },
  actionBtn: { flexDirection: "row", alignItems: "center", gap: 4 },
  actionIcon: { fontSize: 16 },
  actionCount: { color: Colors.textSecondary, fontSize: 13 },
  empty: { alignItems: "center", paddingTop: 80, paddingHorizontal: 40 },
  emptyIcon: { fontSize: 48, marginBottom: Spacing.md },
  emptyTitle: { ...Typography.h3, marginBottom: 8 },
  emptySubtitle: { ...Typography.body, color: Colors.textSecondary, textAlign: "center" },
});
