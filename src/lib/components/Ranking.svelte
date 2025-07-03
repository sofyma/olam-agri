<!-- Ranking.svelte -->
<script lang="ts">
  import { onMount } from 'svelte';
  import { RankingService } from '$lib/services/rankingService';
  import type { CombinedRankingEntry, RegionRankingEntry, TopBrandHeroesEntry } from '$lib/services/rankingService';
  import Game1Logo from './svgs/Game1Logo.svelte';
  import { getRegions } from '$lib/utils/countryRegions';
  
  let topHeroes: TopBrandHeroesEntry[] = [];
  let availableRegions: string[] = [];
  let selectedRegion: string = '';
  let regionRankings: RegionRankingEntry[] = [];
  let searchResults: RegionRankingEntry[] = [];
  let allRankings: RegionRankingEntry[] = [];
  let searchQuery = '';
  let currentPage = 1;
  let totalPages = 1;
  let isLoading = true;
  let error: string | null = null;
  
  onMount(async () => {
    try {
      const rankingService = RankingService.getInstance();
      
      // Load top brand heroes (top 2 from each region)
      topHeroes = await rankingService.getTopBrandHeroes();
      
      // Load available regions
      availableRegions = getRegions();
      
      // Set first region as default if available
      if (availableRegions.length > 0) {
        selectedRegion = availableRegions[0];
        regionRankings = await rankingService.getRankingsByRegion(selectedRegion, 2);
      }
      
      // Load all rankings for search
      allRankings = await rankingService.getAllRankings();
      
      // Load initial search results
      await loadSearchResults();
      
      isLoading = false;
    } catch (err) {
      error = err instanceof Error ? err.message : 'Failed to load rankings';
      isLoading = false;
    }
  });

  async function selectRegion(region: string) {
    try {
      selectedRegion = region;
      const rankingService = RankingService.getInstance();
      regionRankings = await rankingService.getRankingsByRegion(region, 2);
    } catch (err) {
      error = err instanceof Error ? err.message : 'Failed to load region rankings';
    }
  }

  async function loadSearchResults(page: number = 1) {
    try {
      // Filter rankings based on search query
      let filteredRankings = allRankings;
      
      if (searchQuery.trim()) {
        filteredRankings = allRankings.filter(ranking => 
          ranking.user.displayName.toLowerCase().includes(searchQuery.toLowerCase()) ||
          ranking.user.region?.toLowerCase().includes(searchQuery.toLowerCase()) ||
          ranking.user.country?.toLowerCase().includes(searchQuery.toLowerCase())
        );
      }
      
      // Sort by total score (descending)
      const sortedRankings = filteredRankings.sort((a, b) => b.totalScore - a.totalScore);
      
      // Pagination: 5 users per page
      const usersPerPage = 5;
      const startIndex = (page - 1) * usersPerPage;
      const endIndex = startIndex + usersPerPage;
      
      searchResults = sortedRankings.slice(startIndex, endIndex);
      totalPages = Math.ceil(sortedRankings.length / usersPerPage);
      currentPage = page;
    } catch (err) {
      error = err instanceof Error ? err.message : 'Failed to load search results';
    }
  }

  function handleSearch() {
    currentPage = 1; // Reset to first page when searching
    loadSearchResults(1);
  }

  function goToPage(page: number) {
    if (page >= 1 && page <= totalPages) {
      loadSearchResults(page);
    }
  }
</script>

<div class="container">
  <header class="header">
    <div class="wrapper">
      <div class="row">
        <div class="column">
          <Game1Logo />
        </div>

        <div class="column">
          <nav class="navigation">
            <ul class="navigation-list">
              <li class="navigation-item">
                <a class="navigation-link" href="/terms">Terms</a>
              </li>

              <li class="navigation-item">
                <a class="navigation-link btn" href="/ranking">Ranking</a>
              </li>
            </ul>
          </nav>
        </div>
      </div>

      <h1 class="header-title">Brand Heroes</h1>
    </div>

    <img class="header-heroes" src="/images/oa-site-small-header-heroes.png" alt="Brand Heroes">
  </header>
  
  <main class="content">
    <div class="wrapper">
      <div class="ranking-container">
        <h2 class="ranking-title">Ranking</h2>
        
        {#if isLoading}
          <div class="loading">Loading rankings...</div>
        {:else if error}
          <div class="error">{error}</div>
        {:else}
          <!-- TOP BRAND HEROES SECTION -->
          <div class="ranking-section">
            <h3 class="section-title"><strong>Top</strong> Brand Heroes</h3>
            
            <div class="table-container">
              <table class="ranking-table">
                <thead>
                  <tr>
                    <th style="text-align: end;">Region</th>
                    <th style="color: #2E2D2C;">Name</th>
                    <th style="text-align: end;">Points</th>
                  </tr>
                </thead>
                <tbody>
                  {#each topHeroes as entry, i}
                    <tr>
                      <td style="text-align: end;">{entry.region}</td>
                      <td style="color: #2E2D2C;">
                        {#each entry.topPlayers as player, j}
                          <div class="player-name">
                            {player.user.displayName}
                          </div>
                        {/each}
                      </td>
                      <td style="text-align: end;">
                        {#each entry.topPlayers as player, j}
                          <div class="player-score">
                            {player.totalScore}
                          </div>
                        {/each}
                      </td>
                    </tr>
                  {/each}
                </tbody>
              </table>
            </div>
          </div>

          <!-- RANKING BY REGION SECTION -->
          <div class="ranking-section">
            <h3 class="section-title"><strong>Ranking</strong> by Region</h3>
            
            <!-- Region Tabs -->
            <div class="region-tabs">
              {#each availableRegions as region}
                <button 
                  class="region-tab" 
                  class:active={selectedRegion === region}
                  on:click={() => selectRegion(region)}
                >
                  {region}
                </button>
              {/each}
            </div>
            
            {#if selectedRegion}
              <div class="region-content">
                <h4 class="region-title">{selectedRegion}</h4>
                
                <div class="table-container">
                  <table class="ranking-table">
                    <thead>
                      <tr>
                        <th style="text-align: end;">Position</th>
                        <th style="color: #2E2D2C;">Name</th>
                        <th style="text-align: end;">Points</th>
                      </tr>
                    </thead>
                    <tbody>
                      {#each regionRankings as entry, i}
                        <tr>
                          <td class="position" style="text-align: end;">{i + 1}</td>
                          <td class="player-name" style="color: #2E2D2C;">{entry.user.displayName}</td>
                          <td class="points" style="text-align: end;">{entry.totalScore}</td>
                        </tr>
                      {/each}
                    </tbody>
                  </table>
                </div>
              </div>
            {/if}
          </div>

          <!-- SEARCH RESULTS SECTION -->
          <div class="ranking-section">
            <!-- Search Input -->
            <div class="search-container">
              <svg width="26" height="27" viewBox="0 0 26 27" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M10.0308 16.7676L0.99998 25.7984" stroke="#999999" stroke-width="2" stroke-linecap="round"/>
                <circle cx="16.4048" cy="9.59521" r="8.59521" stroke="#999999" stroke-width="2"/>
              </svg>
                
              <input 
                type="text" 
                class="search-input" 
                placeholder="Search"
                bind:value={searchQuery}
                on:input={handleSearch}
              />
            </div>
            
            {#if searchQuery.trim()}
              <div class="table-container">
                <table class="ranking-table">
                  <thead>
                    <tr>
                      <th style="text-align: end;">Position</th>
                      <th style="color: #2E2D2C;">Name</th>
                      <th style="text-align: end;">Points</th>
                    </tr>
                  </thead>
                  <tbody>
                    {#each searchResults as entry, i}
                      <tr>
                        <td style="text-align: end;">{(currentPage - 1) * 5 + i + 1}</td>
                        <td style="color: #2E2D2C;">{entry.user.displayName}</td>
                        <td style="text-align: end;">{entry.totalScore}</td>
                      </tr>
                    {/each}
                  </tbody>
                </table>
              </div>
            {/if}

            <!-- Pagination -->
            {#if searchQuery.trim() && totalPages > 1}
              <div class="pagination">
                <button class="pagination-btn" on:click={() => goToPage(1)} disabled={currentPage === 1}>
                  &lt;&lt;
                </button>
                <button class="pagination-btn" on:click={() => goToPage(currentPage - 1)} disabled={currentPage === 1}>
                  &lt;
                </button>
                <span class="pagination-info">page {currentPage}/{totalPages}</span>
                <button class="pagination-btn" on:click={() => goToPage(currentPage + 1)} disabled={currentPage === totalPages}>
                  &gt;
                </button>
                <button class="pagination-btn" on:click={() => goToPage(totalPages)} disabled={currentPage === totalPages}>
                  &gt;&gt;
                </button>
              </div>
            {/if}
          </div>
        {/if}
      </div>
    </div>
  </main>

  <footer class="footer">
    <img class="footer-logo" src="/images/site-footer.jpg" alt="Brand Heroes">
  </footer>
</div>

<style lang="scss">
  .content {
    margin-block-start: -15rem;
    position: relative;
    z-index: 1;

    .wrapper {
      background-color: #FFF;
      margin-inline: auto;
      max-inline-size: 128rem;
      padding-block: 5rem 15rem;
    }
  }

  .error {
    background-color: #f8d7da;
    border-radius: 1rem;
    color: #dc3545;
    font-size: 1.8rem;
    font-weight: 600;
    margin-block: 2rem;
    padding: 2rem;
    text-align: center;
  }

  .footer {
    &-logo {
      inline-size: 100%;
    }
  }

  .header {
    background-image: url('/images/oa-site-small-header-background.jpg');
    background-position: center top;
    background-repeat: no-repeat;
    background-size: cover;
    block-size: 53.5rem;
    padding-block-start: 7rem;
    position: relative;

    &-heroes {
      inset-block-end: 0;
      inset-inline-start: 50%;
      position: absolute;
      transform: translateX(-50%);
    }

    &-title {
      color: #FFF;
      font-size: 8rem;
      font-weight: 600;
      line-height: normal;
      padding-block-start: 1.5rem;
    }

    :global(.logo path) {
      fill: #FFF;
    }

    .wrapper {
      margin-inline: auto;
      max-inline-size: 142rem;
    }

    .row {
      align-items: center;
      display: flex;
      justify-content: space-between;
    }

    .navigation {
      &-list {
        align-items: center;
        display: flex;
        gap: 3rem;
      }

      &-link {
        color: #000;
        font-size: 1.8rem;
        font-weight: 600;
        line-height: normal;
      }
    }

    .btn {
      align-items: center;
      background-color: #fff;
      block-size: 3.2rem;
      border-radius: 0 1.5rem;
      display: flex;
      inline-size: 11.1rem;
    }

    @media (min-width: 768px) and (max-width: 1024px) {
      .wrapper {
        padding-inline: 2rem;
      }
    }
  }

  .loading {
    color: #2E2D2C;
    font-size: 2rem;
    font-weight: 600;
    padding-block: 5rem;
    text-align: center;
  }

  .pagination {
    align-items: center;
    display: flex;
    gap: 1rem;
    justify-content: center;
    margin-block-start: 3rem;
  }

  .pagination-btn {
    background-color: #E6E6E6;
    border: none;
    border-radius: 1rem;
    color: #2E2D2C;
    cursor: pointer;
    font-size: 1.4rem;
    font-weight: 600;
    padding: 1rem 1.5rem;
    transition: all 0.3s ease;

    &:hover:not(:disabled) {
      background-color: #FF7000;
      color: white;
    }

    &:disabled {
      cursor: not-allowed;
      opacity: 0.5;
    }
  }

  .pagination-info {
    color: #2E2D2C;
    font-size: 1.6rem;
    font-weight: 600;
    margin-inline: 2rem;
  }

  .ranking-container {
    max-inline-size: 100rem;
    margin-inline: auto;
  }

  .ranking-section {
    max-inline-size: 98rem;
    margin-block-start: 12.5rem;
    margin-inline: auto;
  }

    .ranking-table {
    border-collapse: collapse;
    inline-size: 100%;
    overflow: hidden;

    th, td {
      border-bottom: 1px solid #ccc;
      color: #FF7000;
      font-size: 3.5rem;
      font-weight: 600;
      padding: 2rem;
      text-align: left;
      vertical-align: top;
    }

    th {
      color: #FF7000;
      font-size: 3.5rem;
      font-weight: 400;
    }

    tr:last-child td {
      border-bottom: none;
    }

    .player-name {
      color: #2E2D2C;
      font-weight: 700;
      
      &:not(:last-child) {
        margin-block-end: 0.5rem;
      }
    }

    .player-score {
      color: #FF7000;
      font-weight: 700;
      text-align: end;
      
      &:not(:last-child) {
        margin-block-end: 0.5rem;
      }
    }

    .points, .position {
      color: #FF7000;
      font-weight: 700;
      text-align: center;
    }
  }

  .ranking-title {
    color: #FF7000;
    font-size: 7.5rem;
    font-weight: 400;
    line-height: 125%;
    text-align: center;
  }

  .region-content {
    padding-block-start: 12.5rem;
    text-align: center;
  }

  .region-tab {
    border-block-end: .7rem solid transparent;
    font-size: 2.6rem;
    font-weight: 600;

    &.active {
      border-block-end: .7rem solid #FF7000;
    }
  }

  .region-tabs {
    display: flex;
    flex-wrap: wrap;
    gap: 5rem;
    justify-content: center;
    margin-block-start: 5rem;
  }

  .region-title {
    color: #FF7000;
    font-size: 7.5rem;
    font-weight: 400;
    margin-block-end: 5.5rem;
  }

  .search-container {
    display: flex;
    margin-block-end: 3rem;
    margin-inline: auto;
    max-inline-size: 43rem;
    position: relative;
    text-align: center;

    svg {
      inset-block-start: 50%;
      inset-inline-start: 2rem;
      position: absolute;
      transform: translateY(-50%);
    }
  }

  .search-input {
    border: .2rem solid #999;
    border-radius: 50rem;
    color: #999;
    font-size: 1.6rem;
    inline-size: 100%;
    padding: 1.5rem 2rem 1.5rem 6rem;

    &:focus {
      box-shadow: 0 0 0 2px #FF7000;
      outline: none;
    }

    &::placeholder {
      color: #999;
    }
  }

  .section-title {
    align-items: center;
    background-color: #E6E6E6;
    block-size: 9rem;
    border-radius: 0 2.5rem;
    color: #2E2D2C;
    display: flex;
    font-size: 4rem;
    font-weight: 400;
    justify-content: center;
    line-height: 125%;
    text-align: center;

    strong {
      padding-inline-end: 1.1rem;
    }
  }

  .table-container {
    margin-block-end: 3rem;
  }
</style> 